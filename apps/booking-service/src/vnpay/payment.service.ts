import {
  Injectable,
  Logger,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { PrismaService } from '../common/prisma/prisma.service';
import { VnpayService } from './vnpay.service';
import { ApiResponse } from '../common/dto/response.dto';
import { MailService } from '../common/mail/mail.service';

@Injectable()
export class PaymentService {
  private readonly logger = new Logger(PaymentService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly vnpayService: VnpayService,
    private readonly httpService: HttpService,
    private readonly mailService: MailService,
  ) {}

  // ──────────────────────────────────────────────────────────────────────────────
  // Tạo VNPay payment URL cho một booking
  // ──────────────────────────────────────────────────────────────────────────────
  async createVnpayUrl(bookingId: string, userId: string, ipAddr: string) {
    const booking = await this.prisma.booking.findUnique({ where: { id: bookingId } });

    if (!booking) {
      throw new NotFoundException('Không tìm thấy đơn đặt phòng');
    }
    if (booking.tenantId !== userId) {
      throw new ForbiddenException('Bạn không có quyền thanh toán đơn đặt phòng này');
    }
    if (booking.paymentStatus === 'PAID') {
      throw new ForbiddenException('Đơn đặt phòng này đã được thanh toán');
    }

    const amount = Number(booking.totalPrice); // đã là VND
    const paymentUrl = this.vnpayService.createPaymentUrl(bookingId, amount, ipAddr);

    return new ApiResponse({ paymentUrl }, 'Tạo URL thanh toán thành công');
  }

  // ──────────────────────────────────────────────────────────────────────────────
  // Cập nhật trạng thái thanh toán = PAID
  // txnRef = orderId được tạo từ VnpayService (16 chars bookingId + 4 digits)
  // ──────────────────────────────────────────────────────────────────────────────
  async markAsPaid(txnRef: string, transactionId: string, _amount: number) {
    const bookingPrefix = this.vnpayService.extractBookingPrefix(txnRef);

    // Tìm booking có id bắt đầu bằng prefix (đã xoá dấu -)
    const booking = await this.prisma.booking.findFirst({
      where: {
        id: {
          // UUID stored with dashes — rebuild search without dashes
          startsWith: this.prefixToUuidStart(bookingPrefix),
        },
      },
    });

    if (!booking) {
      this.logger.warn(`markAsPaid: không tìm thấy booking với txnRef=${txnRef}`);
      return;
    }

    // Idempotent: bỏ qua nếu đã PAID
    if (booking.paymentStatus === 'PAID') {
      this.logger.log(`Booking ${booking.id} đã được đánh dấu PAID trước đó — bỏ qua`);
      return;
    }

    const updatedBooking = await this.prisma.booking.update({
      where: { id: booking.id },
      data: {
        paymentStatus: 'PAID',
        vnpTransactionId: transactionId,
        paymentDate: new Date(),
      },
    });

    this.logger.log(`Booking ${booking.id} đã được cập nhật PAID, txn=${transactionId}`);

    // Gửi email báo cho Owner biết Tenant đã thanh toán thành công
    try {
      const apartment = await this.getApartment(updatedBooking.apartmentId);
      if (apartment?.ownerId) {
        const owner = await this.getUser(apartment.ownerId);
        if (owner?.email) {
          const start = new Date(updatedBooking.startDate);
          const end = new Date(updatedBooking.endDate);
          const msDiff = end.getTime() - start.getTime();
          const nights = Math.max(1, Math.round(msDiff / (1000 * 60 * 60 * 24)));

          const htmlBody = `
            <h3>Thông báo: Khách thuê đã thanh toán thành công đặt phòng!</h3>
            <p>Xin chào ${owner.fullName || 'chủ nhà'},</p>
            <p>Khách thuê đã thực hiện thanh toán thành công cho đơn đặt phòng tại căn hộ <strong>${apartment.title}</strong> của bạn.</p>
            <p>Thông tin thanh toán chi tiết:</p>
            <ul>
              <li><strong>Mã đơn đặt phòng:</strong> ${updatedBooking.id}</li>
              <li><strong>Thời gian thuê:</strong> Từ ${start.toLocaleDateString('vi-VN')} đến ${end.toLocaleDateString('vi-VN')} (${nights} đêm)</li>
              <li><strong>Số tiền thanh toán:</strong> ${Number(updatedBooking.totalPrice).toLocaleString('vi-VN')} ₫</li>
              <li><strong>Mã giao dịch VNPay:</strong> ${transactionId}</li>
              <li><strong>Thời gian giao dịch:</strong> ${new Date().toLocaleString('vi-VN')}</li>
            </ul>
            <p>Trạng thái đặt phòng hiện tại: <strong>${updatedBooking.status === 'CONFIRMED' ? 'Đã duyệt' : 'Đang chờ duyệt'}</strong></p>
            <p>Vui lòng kiểm tra thông tin trên hệ thống quản lý chủ nhà của bạn.</p>
          `;
          await this.mailService.sendEmail(
            owner.email,
            `[Domin Tactic] Khách thuê thanh toán thành công đặt phòng căn hộ ${apartment.title}`,
            htmlBody
          );
          this.logger.log(`Đã gửi email thông báo thanh toán thành công cho Owner ${owner.email}`);
        } else {
          this.logger.warn(`Không tìm thấy email của Owner ${apartment.ownerId}`);
        }
      } else {
        this.logger.warn(`Không tìm thấy thông tin căn hộ hoặc owner cho booking ${updatedBooking.id}`);
      }
    } catch (emailError: any) {
      this.logger.error(`Lỗi gửi mail thông báo thanh toán cho Owner: ${emailError.message}`);
    }
  }

  // ──────────────────────────────────────────────────────────────────────────────
  // Cập nhật trạng thái thanh toán = FAILED
  // ──────────────────────────────────────────────────────────────────────────────
  async markAsFailed(txnRef: string) {
    const bookingPrefix = this.vnpayService.extractBookingPrefix(txnRef);

    const booking = await this.prisma.booking.findFirst({
      where: {
        id: { startsWith: this.prefixToUuidStart(bookingPrefix) },
      },
    });

    if (!booking || booking.paymentStatus === 'PAID') return;

    await this.prisma.booking.update({
      where: { id: booking.id },
      data: { paymentStatus: 'FAILED' },
    });
  }

  // ──────────────────────────────────────────────────────────────────────────────
  // Helper: chuyển 16-char no-dash prefix về dạng UUID prefix có dấu gạch
  // UUID format: xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
  // 16 chars no-dash = xxxxxxxxxxxxxxxx → xxxxxxxx-xxxx-xxxx
  // ──────────────────────────────────────────────────────────────────────────────
  private prefixToUuidStart(prefix: string): string {
    // prefix = 16 hex chars (no dashes)
    // UUID parts: 8-4-4-4-12
    const p = prefix; // "aabbccdd11223344"
    return `${p.slice(0, 8)}-${p.slice(8, 12)}-${p.slice(12, 16)}`;
  }

  private async getApartment(apartmentId: string): Promise<any> {
    try {
      const { data } = await firstValueFrom(
        this.httpService.get(
          `${process.env.APARTMENT_SERVICE_URL}/api/Apartments/${apartmentId}`,
        ),
      );
      return data?.data ?? data;
    } catch (err: any) {
      this.logger.error(`Lỗi lấy thông tin căn hộ từ apartment-service: ${err.message}`);
      return null;
    }
  }

  private async getUser(userId: string): Promise<any> {
    try {
      const authServiceUrl = process.env.AUTH_SERVICE_URL || 'http://auth-service:3001';
      const { data } = await firstValueFrom(
        this.httpService.get(
          `${authServiceUrl}/api/auth/users/${userId}`,
        ),
      );
      return data?.data ?? data;
    } catch (err: any) {
      this.logger.error(`Lỗi lấy thông tin người dùng từ auth-service: ${err.message}`);
      return null;
    }
  }
}

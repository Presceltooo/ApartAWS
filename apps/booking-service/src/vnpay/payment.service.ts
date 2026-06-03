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
import { SqsProducerService } from '../common/sqs/sqs-producer.service';
import { NotificationEventType } from '../common/sqs/notification-event.interface';

@Injectable()
export class PaymentService {
  private readonly logger = new Logger(PaymentService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly vnpayService: VnpayService,
    private readonly httpService: HttpService,
    private readonly sqsProducer: SqsProducerService,
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

    // Gửi email báo cho Owner qua SQS (bất đồng bộ, fat event)
    try {
      const apartment = await this.getApartment(updatedBooking.apartmentId).catch(() => null);
      const tenant = await this.getUser(updatedBooking.tenantId).catch(() => null);
      const owner = apartment?.ownerId ? await this.getUser(apartment.ownerId).catch(() => null) : null;
      const start = new Date(updatedBooking.startDate);
      const end = new Date(updatedBooking.endDate);
      const msDiff = end.getTime() - start.getTime();
      const nights = Math.max(1, Math.round(msDiff / (1000 * 60 * 60 * 24)));

      this.sqsProducer.publishNotification({
        eventType: NotificationEventType.PAYMENT_SUCCESS,
        timestamp: new Date().toISOString(),
        payload: {
          bookingId: updatedBooking.id,
          apartmentId: updatedBooking.apartmentId,
          apartmentTitle: apartment?.title || 'Căn hộ',
          tenantId: updatedBooking.tenantId,
          tenantEmail: tenant?.email,
          tenantName: tenant?.fullName || tenant?.username,
          ownerId: apartment?.ownerId,
          ownerEmail: owner?.email,
          ownerName: owner?.fullName || owner?.username,
          startDate: updatedBooking.startDate.toISOString(),
          endDate: updatedBooking.endDate.toISOString(),
          nights,
          totalPrice: Number(updatedBooking.totalPrice),
          bookingStatus: updatedBooking.status,
          paymentStatus: updatedBooking.paymentStatus,
          transactionId: transactionId,
        },
      }).catch(err => this.logger.error(`Lỗi gửi SQS PAYMENT_SUCCESS: ${err.message}`));
    } catch (err: any) {
      this.logger.error(`Lỗi publish SQS payment success event: ${err.message}`);
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

    const updatedBooking = await this.prisma.booking.update({
      where: { id: booking.id },
      data: { paymentStatus: 'FAILED' },
    });

    // Publish event PAYMENT_FAILED to SQS
    try {
      const apartment = await this.getApartment(updatedBooking.apartmentId).catch(() => null);
      const tenant = await this.getUser(updatedBooking.tenantId).catch(() => null);
      const owner = apartment?.ownerId ? await this.getUser(apartment.ownerId).catch(() => null) : null;
      const start = new Date(updatedBooking.startDate);
      const end = new Date(updatedBooking.endDate);
      const msDiff = end.getTime() - start.getTime();
      const nights = Math.max(1, Math.round(msDiff / (1000 * 60 * 60 * 24)));

      this.sqsProducer.publishNotification({
        eventType: NotificationEventType.PAYMENT_FAILED,
        timestamp: new Date().toISOString(),
        payload: {
          bookingId: updatedBooking.id,
          apartmentId: updatedBooking.apartmentId,
          apartmentTitle: apartment?.title || 'Căn hộ',
          tenantId: updatedBooking.tenantId,
          tenantEmail: tenant?.email,
          tenantName: tenant?.fullName || tenant?.username,
          ownerId: apartment?.ownerId,
          ownerEmail: owner?.email,
          ownerName: owner?.fullName || owner?.username,
          startDate: updatedBooking.startDate.toISOString(),
          endDate: updatedBooking.endDate.toISOString(),
          nights,
          totalPrice: Number(updatedBooking.totalPrice),
          bookingStatus: updatedBooking.status,
          paymentStatus: updatedBooking.paymentStatus,
          failureReason: 'Giao dịch VNPay thất bại hoặc bị hủy',
        },
      }).catch(err => this.logger.error(`Lỗi gửi SQS PAYMENT_FAILED: ${err.message}`));
    } catch (err: any) {
      this.logger.error(`Lỗi publish SQS payment failed event: ${err.message}`);
    }
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

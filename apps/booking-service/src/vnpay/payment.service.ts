import {
  Injectable,
  Logger,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from '../common/prisma/prisma.service';
import { VnpayService } from './vnpay.service';
import { ApiResponse } from '../common/dto/response.dto';

@Injectable()
export class PaymentService {
  private readonly logger = new Logger(PaymentService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly vnpayService: VnpayService,
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

    await this.prisma.booking.update({
      where: { id: booking.id },
      data: {
        paymentStatus: 'PAID',
        vnpTransactionId: transactionId,
        paymentDate: new Date(),
      },
    });

    this.logger.log(`Booking ${booking.id} đã được cập nhật PAID, txn=${transactionId}`);
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
}

import {
  Controller,
  Get,
  Param,
  Query,
  Req,
  Res,
  Logger,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiParam, ApiQuery } from '@nestjs/swagger';
import type { Request, Response } from 'express';
import { VnpayService } from './vnpay.service';
import { PaymentService } from './payment.service';
import { CurrentUser } from '../common/decorators/user.decorator';

@ApiTags('Payments (VNPay)')
@Controller('Bookings/payments')
export class PaymentController {
  private readonly logger = new Logger(PaymentController.name);

  constructor(
    private readonly vnpayService: VnpayService,
    private readonly paymentService: PaymentService,
  ) {}

  // ─── 1. Lấy URL thanh toán VNPay ────────────────────────────────────────────
  @Get('vnpay-url/:bookingId')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Tạo URL thanh toán VNPay cho một booking' })
  @ApiParam({ name: 'bookingId', type: String })
  async getPaymentUrl(
    @Param('bookingId') bookingId: string,
    @CurrentUser('userId') userId: string,
    @Req() req: Request,
  ) {
    const ipAddr =
      (req.headers['x-forwarded-for'] as string)?.split(',')[0] ||
      req.socket.remoteAddress ||
      '127.0.0.1';

    return this.paymentService.createVnpayUrl(bookingId, userId, ipAddr);
  }

  // ─── 2. Return URL — VNPay redirect sau khi người dùng thanh toán ───────────
  @Get('vnpay-return')
  @ApiOperation({ summary: 'VNPay Return URL (redirect sau khi thanh toán)' })
  async vnpayReturn(@Query() query: Record<string, string>, @Res() res: Response) {
    const frontendUrl = process.env.FRONTEND_URL ?? 'http://localhost:5174';
    const resultPath = '/booking/ket-qua-thanh-toan';

    const isValid = this.vnpayService.validateSignature(query);
    if (!isValid) {
      this.logger.warn('VNPay Return: chữ ký không hợp lệ');
      return res.redirect(`${frontendUrl}${resultPath}?status=error&message=invalid_signature`);
    }

    const responseCode = query['vnp_ResponseCode'];
    const txnRef = query['vnp_TxnRef'];
    const transactionId = query['vnp_TransactionNo'];
    const amount = Number(query['vnp_Amount']) / 100; // chia 100 lấy lại VND

    if (responseCode === '00') {
      // Thành công — cập nhật DB (best-effort, IPN mới là nguồn tin cậy)
      await this.paymentService.markAsPaid(txnRef, transactionId, amount).catch((err) =>
        this.logger.error('Return URL update error (non-critical):', err),
      );
      return res.redirect(
        `${frontendUrl}${resultPath}?status=success&txnRef=${txnRef}&amount=${amount}&transactionId=${transactionId}`,
      );
    } else {
      return res.redirect(
        `${frontendUrl}${resultPath}?status=fail&code=${responseCode}&txnRef=${txnRef}`,
      );
    }
  }

  // ─── 3. IPN — VNPay thông báo server-to-server (tin cậy nhất) ───────────────
  @Get('vnpay-ipn')
  @ApiOperation({ summary: 'VNPay IPN endpoint (server-to-server callback)' })
  async vnpayIpn(@Query() query: Record<string, string>, @Res() res: Response) {
    const isValid = this.vnpayService.validateSignature(query);
    if (!isValid) {
      this.logger.warn('VNPay IPN: chữ ký không hợp lệ');
      return res.status(200).json({ RspCode: '97', Message: 'Invalid signature' });
    }

    const txnRef = query['vnp_TxnRef'];
    const responseCode = query['vnp_ResponseCode'];
    const transactionId = query['vnp_TransactionNo'];
    const amount = Number(query['vnp_Amount']) / 100;

    try {
      if (responseCode === '00') {
        await this.paymentService.markAsPaid(txnRef, transactionId, amount);
        this.logger.log(`IPN: Thanh toán thành công cho txnRef=${txnRef}`);
        return res.status(200).json({ RspCode: '00', Message: 'Confirm Success' });
      } else {
        await this.paymentService.markAsFailed(txnRef);
        this.logger.warn(`IPN: Thanh toán thất bại cho txnRef=${txnRef}, code=${responseCode}`);
        return res.status(200).json({ RspCode: '00', Message: 'Confirm Success' });
      }
    } catch (err) {
      this.logger.error('IPN processing error:', err);
      return res.status(200).json({ RspCode: '99', Message: 'Unknown error' });
    }
  }
}

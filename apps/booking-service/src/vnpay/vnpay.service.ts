import { Injectable, Logger } from '@nestjs/common';
import * as crypto from 'crypto';

@Injectable()
export class VnpayService {
  private readonly logger = new Logger(VnpayService.name);

  private readonly vnp_TmnCode = process.env.VNP_TMN_CODE!;
  private readonly vnp_HashSecret = process.env.VNP_HASH_SECRET!;
  private readonly vnp_Url = process.env.VNP_URL || 'https://sandbox.vnpayment.vn/paymentv2/vpcpay.html';
  private readonly vnp_ReturnUrl = process.env.VNP_RETURN_URL!;

  // ──────────────────────────────────────────────────────────────────────────────
  // Tạo URL thanh toán
  // ──────────────────────────────────────────────────────────────────────────────
  createPaymentUrl(bookingId: string, amount: number, ipAddr: string, locale = 'vn'): string {
    const date = new Date();
    const createDate = this.formatDate(date);
    const orderId = `${bookingId.replace(/-/g, '').slice(0, 16)}${date.getTime().toString().slice(-4)}`;

    // VNPay yêu cầu amount * 100 (tính bằng đồng × 100)
    const vnpAmount = amount * 100;

    const params: Record<string, string> = {
      vnp_Version: '2.1.0',
      vnp_Command: 'pay',
      vnp_TmnCode: this.vnp_TmnCode,
      vnp_Amount: String(vnpAmount),
      vnp_CurrCode: 'VND',
      vnp_TxnRef: orderId,
      vnp_OrderInfo: `Thanh toan dat phong ${bookingId}`,
      vnp_OrderType: 'other',
      vnp_Locale: locale,
      vnp_ReturnUrl: this.vnp_ReturnUrl,
      vnp_IpAddr: ipAddr,
      vnp_CreateDate: createDate,
    };

    // Sắp xếp theo thứ tự alphabet rồi build query string
    const sortedParams = this.sortObject(params);
    const signData = new URLSearchParams(sortedParams).toString();
    const hmac = crypto.createHmac('sha512', this.vnp_HashSecret);
    const signed = hmac.update(Buffer.from(signData, 'utf-8')).digest('hex');

    sortedParams['vnp_SecureHash'] = signed;
    const paymentUrl = `${this.vnp_Url}?${new URLSearchParams(sortedParams).toString()}`;

    this.logger.log(`Payment URL created for booking: ${bookingId}`);
    return paymentUrl;
  }

  // ──────────────────────────────────────────────────────────────────────────────
  // Kiểm tra chữ ký phản hồi từ VNPay (dùng cho cả Return URL và IPN)
  // ──────────────────────────────────────────────────────────────────────────────
  validateSignature(vnpParams: Record<string, string>): boolean {
    const secureHash = vnpParams['vnp_SecureHash'];
    if (!secureHash) return false;

    const params = { ...vnpParams };
    delete params['vnp_SecureHash'];
    delete params['vnp_SecureHashType'];

    const sortedParams = this.sortObject(params);
    const signData = new URLSearchParams(sortedParams).toString();
    const hmac = crypto.createHmac('sha512', this.vnp_HashSecret);
    const signed = hmac.update(Buffer.from(signData, 'utf-8')).digest('hex');

    return signed === secureHash;
  }

  // ──────────────────────────────────────────────────────────────────────────────
  // Lấy bookingId từ vnp_TxnRef (đảo ngược quá trình tạo orderId)
  // orderId = bookingId (no dashes, first 16 chars) + last 4 digits of timestamp
  // ──────────────────────────────────────────────────────────────────────────────
  extractBookingPrefix(txnRef: string): string {
    // TxnRef = 16 chars bookingId prefix + 4 digits timestamp
    return txnRef.slice(0, 16);
  }

  // ──────────────────────────────────────────────────────────────────────────────
  // Helpers
  // ──────────────────────────────────────────────────────────────────────────────
  private formatDate(date: Date): string {
    const pad = (n: number) => String(n).padStart(2, '0');
    return (
      `${date.getFullYear()}` +
      `${pad(date.getMonth() + 1)}` +
      `${pad(date.getDate())}` +
      `${pad(date.getHours())}` +
      `${pad(date.getMinutes())}` +
      `${pad(date.getSeconds())}`
    );
  }

  private sortObject(obj: Record<string, string>): Record<string, string> {
    return Object.keys(obj)
      .sort()
      .reduce<Record<string, string>>((sorted, key) => {
        sorted[key] = obj[key];
        return sorted;
      }, {});
  }
}

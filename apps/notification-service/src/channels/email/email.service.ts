import { Injectable, Logger } from '@nestjs/common';
import { SESClient, SendEmailCommand } from '@aws-sdk/client-ses';
import * as templates from './templates';

@Injectable()
export class EmailService {
  private readonly logger = new Logger(EmailService.name);
  private sesClient: SESClient | null = null;
  private isConfigured = false;

  constructor() {
    const region = process.env.AWS_REGION;
    const accessKeyId = process.env.AWS_ACCESS_KEY_ID;
    const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY;

    if (region && accessKeyId && secretAccessKey) {
      this.sesClient = new SESClient({
        region,
        credentials: {
          accessKeyId,
          secretAccessKey,
        },
      });
      this.isConfigured = true;
      this.logger.log('AWS SES Client initialized successfully in notification-service.');
    } else {
      this.logger.warn('AWS SES credentials not fully provided. EmailService will run in MOCK mode.');
    }
  }

  async sendEmail(to: string, subject: string, htmlBody: string): Promise<boolean> {
    if (!this.isConfigured || !this.sesClient) {
      this.logger.log(`[MOCK EMAIL] To: ${to} | Subject: ${subject}`);
      this.logger.log(`[MOCK EMAIL BODY]\n${htmlBody}`);
      return true;
    }

    try {
      const command = new SendEmailCommand({
        Source: process.env.MAIL_FROM || 'support@apartaws.com',
        Destination: {
          ToAddresses: [to],
        },
        Message: {
          Subject: { Data: subject },
          Body: {
            Html: { Data: htmlBody },
          },
        },
      });

      await this.sesClient.send(command);
      this.logger.log(`Email sent successfully to ${to}`);
      return true;
    } catch (error: any) {
      // Handle SES Sandbox unverified destination address error
      if (error.name === 'MessageRejected' && error.message.includes('not verified')) {
        const fallbackRecipient = process.env.MAIL_FROM;
        if (fallbackRecipient && to !== fallbackRecipient) {
          this.logger.warn(`Destination address ${to} is not verified in SES Sandbox. Redirecting email to verified sender: ${fallbackRecipient}`);
          try {
            const redirectCommand = new SendEmailCommand({
              Source: fallbackRecipient,
              Destination: {
                ToAddresses: [fallbackRecipient],
              },
              Message: {
                Subject: { Data: `[DEV REDIRECT to: ${to}] ${subject}` },
                Body: {
                  Html: { Data: htmlBody },
                },
              },
            });
            await this.sesClient.send(redirectCommand);
            this.logger.log(`Redirected email successfully to ${fallbackRecipient}`);
            return true;
          } catch (redirectError: any) {
            this.logger.error(`Failed to send redirected email to ${fallbackRecipient}: ${redirectError.message}`);
          }
        }
      }
      this.logger.error(`Failed to send email to ${to}: ${(error as Error).message}`, (error as Error).stack);
      return false;
    }
  }

  // Event Handlers for Booking/Payment Events
  async sendBookingCreatedEmail(payload: any) {
    if (payload.tenantEmail) {
      const subject = `[ApartAWS] Đã ghi nhận yêu cầu đặt phòng #${payload.bookingId}`;
      const body = templates.getBookingCreatedTenantEmail(payload);
      await this.sendEmail(payload.tenantEmail, subject, body);
    }
    if (payload.ownerEmail) {
      const subject = payload.bookingStatus === 'CONFIRMED'
        ? `[ApartAWS] Đơn đặt phòng mới đã được duyệt tự động căn hộ ${payload.apartmentTitle}`
        : `[ApartAWS] Yêu cầu đặt phòng mới cần duyệt căn hộ ${payload.apartmentTitle}`;
      const body = templates.getBookingCreatedOwnerEmail(payload);
      await this.sendEmail(payload.ownerEmail, subject, body);
    }
  }

  async sendBookingConfirmedEmail(payload: any) {
    if (payload.tenantEmail) {
      const subject = `[ApartAWS] Đơn đặt phòng #${payload.bookingId} của bạn đã được duyệt!`;
      const body = templates.getBookingConfirmedEmail(payload);
      await this.sendEmail(payload.tenantEmail, subject, body);
    }
  }

  async sendBookingCancelledEmail(payload: any) {
    if (payload.tenantEmail) {
      const subject = `[ApartAWS] Hủy đơn đặt phòng #${payload.bookingId} thành công`;
      const body = templates.getBookingCancelledEmail(payload, 'tenant');
      await this.sendEmail(payload.tenantEmail, subject, body);
    }
    if (payload.ownerEmail) {
      const subject = `[ApartAWS] Thông báo: Khách đã hủy đặt phòng #${payload.bookingId}`;
      const body = templates.getBookingCancelledEmail(payload, 'owner');
      await this.sendEmail(payload.ownerEmail, subject, body);
    }
  }

  async sendBookingCompletedEmail(payload: any) {
    if (payload.tenantEmail) {
      const subject = `[ApartAWS] Cảm ơn bạn đã lưu trú tại căn hộ ${payload.apartmentTitle}!`;
      const body = templates.getBookingCompletedEmail(payload);
      await this.sendEmail(payload.tenantEmail, subject, body);
    }
  }

  async sendPaymentSuccessEmail(payload: any) {
    if (payload.tenantEmail) {
      const subject = `[ApartAWS] Xác nhận thanh toán thành công đặt phòng #${payload.bookingId}`;
      const body = templates.getPaymentSuccessEmail(payload, 'tenant');
      await this.sendEmail(payload.tenantEmail, subject, body);
    }
    if (payload.ownerEmail) {
      const subject = `[ApartAWS] Khách thuê đã thanh toán thành công đặt phòng #${payload.bookingId}`;
      const body = templates.getPaymentSuccessEmail(payload, 'owner');
      await this.sendEmail(payload.ownerEmail, subject, body);
    }
  }

  async sendPaymentFailedEmail(payload: any) {
    if (payload.tenantEmail) {
      const subject = `[ApartAWS] Cảnh báo: Thanh toán thất bại đặt phòng #${payload.bookingId}`;
      const body = templates.getPaymentFailedEmail(payload);
      await this.sendEmail(payload.tenantEmail, subject, body);
    }
  }
}

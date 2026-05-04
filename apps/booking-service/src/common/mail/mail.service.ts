import { Injectable, Logger } from '@nestjs/common';
import { SESClient, SendEmailCommand } from '@aws-sdk/client-ses';

@Injectable()
export class MailService {
  private readonly logger = new Logger(MailService.name);
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
      this.logger.log('AWS SES Client initialized successfully.');
    } else {
      this.logger.warn('AWS SES credentials not fully provided. Mailer will run in MOCK mode.');
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
        Source: process.env.MAIL_FROM || 'no-reply@aura-heritage.com', // MUST be verified in SES
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
    } catch (error) {
      this.logger.error(`Failed to send email to ${to}: ${(error as Error).message}`, (error as Error).stack);
      return false;
    }
  }
}

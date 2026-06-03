import { Injectable, Logger } from '@nestjs/common';
import { EmailService } from '../channels/email/email.service';
import { NotificationEvent, NotificationEventType } from '../common/interfaces/notification-event.interface';

@Injectable()
export class NotificationService {
  private readonly logger = new Logger(NotificationService.name);

  constructor(private readonly emailService: EmailService) {}

  async handleEvent(event: NotificationEvent): Promise<void> {
    this.logger.log(`Handling notification event of type: ${event.eventType}`);
    switch (event.eventType) {
      case NotificationEventType.BOOKING_CREATED:
        await this.emailService.sendBookingCreatedEmail(event.payload);
        break;
      case NotificationEventType.BOOKING_CONFIRMED:
        await this.emailService.sendBookingConfirmedEmail(event.payload);
        break;
      case NotificationEventType.BOOKING_CANCELLED:
        await this.emailService.sendBookingCancelledEmail(event.payload);
        break;
      case NotificationEventType.BOOKING_COMPLETED:
        await this.emailService.sendBookingCompletedEmail(event.payload);
        break;
      case NotificationEventType.PAYMENT_SUCCESS:
        await this.emailService.sendPaymentSuccessEmail(event.payload);
        break;
      case NotificationEventType.PAYMENT_FAILED:
        await this.emailService.sendPaymentFailedEmail(event.payload);
        break;
      default:
        this.logger.warn(`Unhandled notification event type: ${event.eventType}`);
    }
  }
}

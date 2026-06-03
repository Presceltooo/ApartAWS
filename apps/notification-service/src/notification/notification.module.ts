import { Module } from '@nestjs/common';
import { EmailModule } from '../channels/email/email.module';
import { NotificationService } from './notification.service';
import { SqsConsumerService } from './sqs-consumer.service';

@Module({
  imports: [EmailModule],
  providers: [NotificationService, SqsConsumerService],
  exports: [NotificationService],
})
export class NotificationModule {}

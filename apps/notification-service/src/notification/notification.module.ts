import { Module } from '@nestjs/common';
import { EmailModule } from '../channels/email/email.module';
import { NotificationService } from './notification.service';
import { SqsConsumerService } from './sqs-consumer.service';
import { NotificationController } from './notification.controller';

@Module({
  imports: [EmailModule],
  controllers: [NotificationController],
  providers: [NotificationService, SqsConsumerService],
  exports: [NotificationService],
})
export class NotificationModule {}

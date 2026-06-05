import { Module } from '@nestjs/common';
import { EmailModule } from '../channels/email/email.module';
import { NotificationService } from './notification.service';
import { SqsConsumerService } from './sqs-consumer.service';
import { NotificationController } from './notification.controller';
import { SseController } from './sse.controller';
import { SseGatewayService } from './sse-gateway.service';

@Module({
  imports: [EmailModule],
  controllers: [NotificationController, SseController],
  providers: [NotificationService, SqsConsumerService, SseGatewayService],
  exports: [NotificationService],
})
export class NotificationModule {}

import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { SqsProducerModule } from '../common/sqs/sqs-producer.module';
import { VnpayService } from './vnpay.service';
import { PaymentService } from './payment.service';
import { PaymentController } from './payment.controller';

@Module({
  imports: [
    HttpModule.register({
      timeout: 5000,
      maxRedirects: 3,
    }),
    SqsProducerModule,
  ],
  controllers: [PaymentController],
  providers: [VnpayService, PaymentService],
  exports: [VnpayService, PaymentService],
})
export class VnpayModule {}

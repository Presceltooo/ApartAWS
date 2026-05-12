import { Module } from '@nestjs/common';
import { VnpayService } from './vnpay.service';
import { PaymentService } from './payment.service';
import { PaymentController } from './payment.controller';

@Module({
  controllers: [PaymentController],
  providers: [VnpayService, PaymentService],
  exports: [VnpayService, PaymentService],
})
export class VnpayModule {}

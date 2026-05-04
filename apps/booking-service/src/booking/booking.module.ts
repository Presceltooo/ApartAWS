import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { MailModule } from '../common/mail/mail.module';
import { BookingsController } from './booking.controller';
import { BookingsService } from './booking.service';

@Module({
  imports: [
    HttpModule.register({
      timeout: 5000,
      maxRedirects: 3,
    }),
    MailModule,
  ],
  controllers: [BookingsController],
  providers: [BookingsService],
})
export class BookingModule {}

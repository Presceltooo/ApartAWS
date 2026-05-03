import { Module } from '@nestjs/common';
import { ApartmentsController } from './apartment.controller';
import { ApartmentsService } from './apartment.service';
import { S3Service } from '../common/s3/s3.service';

@Module({
  controllers: [ApartmentsController],
  providers: [ApartmentsService, S3Service],
})
export class ApartmentsModule {}

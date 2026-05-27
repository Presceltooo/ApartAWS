import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsNumber, IsPositive } from 'class-validator';

export class CreateBookingDto {
  @ApiProperty({ description: 'ID căn hộ cần đặt', example: 'uuid-apartment-id' })
  @IsString()
  @IsNotEmpty()
  apartmentId: string;

  @ApiProperty({ description: 'Ngày nhận phòng (ISO 8601)', example: '2026-06-01T00:00:00.000Z' })
  @IsString()
  @IsNotEmpty()
  startDate: string;

  @ApiProperty({ description: 'Ngày trả phòng (ISO 8601)', example: '2026-06-05T00:00:00.000Z' })
  @IsString()
  @IsNotEmpty()
  endDate: string;

  @ApiProperty({ description: 'Tổng tiền (VND)', example: 2500000 })
  @IsNumber()
  @IsPositive()
  totalPrice: number;
}

import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsNumber, IsPositive, IsDateString, IsOptional } from 'class-validator';

export class CreateBookingDto {
  @ApiProperty({ description: 'ID căn hộ', example: 'uuid-apartment-id' })
  @IsString()
  @IsNotEmpty()
  apartmentId: string;

  @ApiProperty({ description: 'Ngày bắt đầu (ISO 8601)', example: '2026-05-01T00:00:00.000Z' })
  @IsDateString()
  @IsNotEmpty()
  startDate: string;

  @ApiProperty({ description: 'Ngày kết thúc (ISO 8601)', example: '2026-05-05T00:00:00.000Z' })
  @IsDateString()
  @IsNotEmpty()
  endDate: string;

  @ApiPropertyOptional({
    description: 'Tổng tiền (VND) đã tính sẵn từ frontend (bao gồm phí dịch vụ, phí vệ sinh, v.v.). Nếu không truyền, backend tự tính pricePerNight × số đêm.',
    example: 1555000,
  })
  @IsOptional()
  @IsNumber()
  @IsPositive()
  totalPrice?: number;

  @ApiPropertyOptional({
    description: 'Số lượng khách',
    example: 2,
  })
  @IsOptional()
  @IsNumber()
  @IsPositive()
  guests?: number;
}

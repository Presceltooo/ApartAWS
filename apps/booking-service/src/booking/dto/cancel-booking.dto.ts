import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, MaxLength } from 'class-validator';
import { Transform } from 'class-transformer';

export class CancelBookingDto {
  @ApiPropertyOptional({
    description: 'Lý do hủy đặt phòng',
    example: 'Thay đổi kế hoạch',
  })
  @IsOptional()
  @Transform(({ value }) => value?.trim())
  @IsString()
  @MaxLength(500)
  reason?: string;
}

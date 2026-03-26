import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateBookingDto {
  @ApiProperty({ description: 'ID căn hộ', example: '123456789' })
  apartmentId: string;

  @ApiProperty({ description: 'Ngày bắt đầu', example: '2022-01-01' })
  startDate: string;

  @ApiProperty({ description: 'Ngày kết thúc', example: '2022-01-01' })
  endDate: string;

  @ApiProperty({ description: 'Tổng tiền', example: 1000000 })
  totalPrice: number;

  @ApiProperty({ description: 'ID người đặt', example: '123456789' })
  tenantId: string;
}
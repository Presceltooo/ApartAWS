import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateApartmentDto {
  @ApiProperty({ description: 'Tên căn hộ', example: 'Landmark 81 - Tầng 20' })
  title: string;

  @ApiProperty({ description: 'Giá tiền mỗi đêm (VND)', example: 2000000 })
  pricePerNight: number;

  @ApiPropertyOptional({ description: 'Mô tả ngắn gọn', example: 'View bao trọn sông Sài Gòn' })
  description?: string;

  @ApiProperty({ description: 'Vị trí căn hộ', example: 'Quận 1, TP.HCM' })
  location: string;

  @ApiProperty({ description: 'Tiện ích căn hộ', example: ['Wifi', 'TV', 'Bếp'] })
  amenities: string[];

  @ApiProperty({ description: 'Ảnh căn hộ', example: ['url1', 'url2'] })
  images: string[];

  @ApiPropertyOptional({ description: 'Trạng thái căn hộ', example: true, default: true })
  isActive?: boolean;

  @ApiPropertyOptional({ description: 'ID chủ sở hữu', example: '123456789' })
  ownerId?: string;
}

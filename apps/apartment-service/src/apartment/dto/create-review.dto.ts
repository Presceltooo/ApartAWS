import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateReviewDto {
  @ApiProperty({ description: 'ID của lượt đặt phòng', example: 'd3b07384-d113-4ec2-a279-d5a26563eb6b' })
  bookingId: string;

  @ApiProperty({ description: 'Đánh giá sao (từ 1 đến 5)', example: 5 })
  rating: number;

  @ApiPropertyOptional({ description: 'Nhận xét chi tiết', example: 'Căn hộ rất sạch đẹp, view tuyệt vời!' })
  comment?: string;
}

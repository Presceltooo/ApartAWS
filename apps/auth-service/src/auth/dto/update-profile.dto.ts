import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsOptional, Matches } from 'class-validator';

export class UpdateProfileDto {
  @ApiPropertyOptional({ example: 'John Doe' })
  @IsString()
  @IsOptional()
  fullName?: string;

  @ApiPropertyOptional({ example: '0987654321' })
  @IsString()
  @IsOptional()
  @Matches(/^[0-9]{10,11}$/, { message: 'Số điện thoại không hợp lệ' })
  phone?: string;

  @ApiPropertyOptional({ example: '123 Main St, City' })
  @IsString()
  @IsOptional()
  address?: string;
}

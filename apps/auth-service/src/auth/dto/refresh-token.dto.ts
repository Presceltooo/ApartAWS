import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class RefreshTokenDto {
  @ApiProperty({ description: 'Refresh token nhận được từ lần login/refresh trước' })
  @IsString()
  @IsNotEmpty()
  refreshToken: string;
}

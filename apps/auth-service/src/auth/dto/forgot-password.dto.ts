import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty } from 'class-validator';

export class ForgotPasswordDto {
  @ApiProperty({ example: 'ban@heritage.com', description: 'Email tài khoản cần lấy lại mật khẩu' })
  @IsEmail()
  @IsNotEmpty()
  email: string;
}

import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsEnum, IsNotEmpty, IsString, MinLength } from 'class-validator';
import { Role } from '../../../common/constants/role.enum';

export class CreateUserDto {
  @ApiProperty({ description: 'Email', example: 'user@example.com' })
  @IsEmail({}, { message: 'Email không hợp lệ' })
  email: string;

  @ApiProperty({ description: 'Mật khẩu (tối thiểu 6 ký tự)', example: '123456' })
  @IsString()
  @MinLength(6, { message: 'Mật khẩu phải có ít nhất 6 ký tự' })
  password: string;

  @ApiProperty({ description: 'Họ và tên', example: 'Nguyễn Văn A' })
  @IsString()
  @IsNotEmpty({ message: 'Họ và tên không được để trống' })
  fullName: string;

  @ApiProperty({ description: 'Số điện thoại', example: '0123456789' })
  @IsString()
  @IsNotEmpty()
  phone: string;

  @ApiProperty({ description: 'Địa chỉ', example: 'Quận 1, TP.HCM' })
  @IsString()
  @IsNotEmpty()
  address: string;

  @ApiProperty({ description: 'Vai trò', enum: Role, example: Role.OWNER })
  @IsEnum(Role, { message: 'Vai trò không hợp lệ (ADMIN | OWNER | TENANT)' })
  role: Role;
}

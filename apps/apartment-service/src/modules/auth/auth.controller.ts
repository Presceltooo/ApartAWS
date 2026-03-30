import {
  Controller,
  Get,
  Post,
  Body,
  HttpStatus,
  HttpCode,
  Patch,
  UseGuards,
  Req,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { Request } from 'express';
import { AuthService } from './auth.service';
import { CreateUserDto, LoginDto, VerifyDto, ChangePasswordDto } from './dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';

@ApiTags('Auth')
@Controller('Auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Đăng ký tài khoản' })
  @ApiResponse({ status: 201, description: 'Đăng ký thành công' })
  @ApiResponse({ status: 409, description: 'Email đã được sử dụng' })
  register(@Body() createUserDto: CreateUserDto) {
    return this.authService.register(createUserDto);
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Đăng nhập tài khoản' })
  @ApiResponse({ status: 200, description: 'Đăng nhập thành công' })
  @ApiResponse({ status: 401, description: 'Email hoặc mật khẩu không chính xác' })
  login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

  // API dành riêng cho Gateway — xác thực token và trả về { userId, role }
  @Post('verify')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Xác thực token (Gateway internal)' })
  @ApiResponse({ status: 200, description: 'Token hợp lệ' })
  @ApiResponse({ status: 401, description: 'Token không hợp lệ' })
  verify(@Body() verifyDto: VerifyDto) {
    return this.authService.verify(verifyDto);
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Lấy thông tin người dùng đang đăng nhập' })
  @ApiResponse({ status: 200, description: 'Thông tin người dùng' })
  @ApiResponse({ status: 401, description: 'Chưa đăng nhập' })
  me(@Req() req: Request & { user: { userId: string } }) {
    return this.authService.me(req.user.userId);
  }

  @Patch('change-password')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Đổi mật khẩu' })
  @ApiResponse({ status: 200, description: 'Đổi mật khẩu thành công' })
  @ApiResponse({ status: 401, description: 'Token không hợp lệ hoặc mật khẩu cũ sai' })
  changePassword(
    @Body() changePasswordDto: ChangePasswordDto,
    @Req() req: Request & { user: { userId: string } },
  ) {
    return this.authService.changePassword(changePasswordDto, req.user.userId);
  }
}

import {
  Injectable,
  ConflictException,
  UnauthorizedException,
  NotFoundException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../../common/prisma/prisma.service';
import { ApiResponse } from '../../common/dto/response.dto';
import { CreateUserDto, ChangePasswordDto, LoginDto, VerifyDto } from './dto';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  // Đăng ký tài khoản
  async register(createUserDto: CreateUserDto) {
    // Kiểm tra email đã tồn tại chưa
    const existing = await this.prisma.user.findUnique({
      where: { email: createUserDto.email },
    });
    if (existing) {
      throw new ConflictException('Email đã được sử dụng');
    }

    // Hash mật khẩu trước khi lưu
    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);
    const user = await this.prisma.user.create({
      data: { ...createUserDto, password: hashedPassword },
      select: { id: true, email: true, fullName: true, role: true, createdAt: true },
    });

    return new ApiResponse(user, 'Đăng ký thành công');
  }

  // Đăng nhập
  async login(loginDto: LoginDto) {
    const user = await this.prisma.user.findUnique({
      where: { email: loginDto.email },
    });
    if (!user) {
      throw new UnauthorizedException('Email hoặc mật khẩu không chính xác');
    }

    const isPasswordValid = await bcrypt.compare(loginDto.password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Email hoặc mật khẩu không chính xác');
    }

    const payload = { sub: user.id, role: user.role };
    const accessToken = this.jwtService.sign(payload);

    return new ApiResponse(
      {
        accessToken,
        user: { id: user.id, email: user.email, role: user.role },
      },
      'Đăng nhập thành công',
    );
  }

  // Xác thực token (dành cho Gateway)
  async verify(verifyDto: VerifyDto) {
    try {
      const payload = this.jwtService.verify(verifyDto.token);
      return new ApiResponse(
        { userId: payload.sub, role: payload.role },
        'Token hợp lệ',
      );
    } catch {
      throw new UnauthorizedException('Token không hợp lệ hoặc đã hết hạn');
    }
  }

  // Lấy thông tin người dùng đang đăng nhập
  async me(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, email: true, fullName: true, phone: true, address: true, role: true, createdAt: true },
    });
    if (!user) {
      throw new NotFoundException('Không tìm thấy người dùng');
    }
    return new ApiResponse(user, 'Thông tin người dùng');
  }

  // Đổi mật khẩu
  async changePassword(changePasswordDto: ChangePasswordDto, userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });
    if (!user) {
      throw new NotFoundException('Không tìm thấy người dùng');
    }

    const isPasswordValid = await bcrypt.compare(changePasswordDto.oldPassword, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Mật khẩu cũ không chính xác');
    }

    const hashedPassword = await bcrypt.hash(changePasswordDto.newPassword, 10);
    await this.prisma.user.update({
      where: { id: userId },
      data: { password: hashedPassword },
    });

    return new ApiResponse(null, 'Đổi mật khẩu thành công');
  }
}

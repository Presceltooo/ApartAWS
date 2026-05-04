import {
  Injectable,
  ConflictException,
  UnauthorizedException,
  NotFoundException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto';
import { PrismaService } from '../common/prisma/prisma.service';
import { ApiResponse } from '../common/dto/response.dto';
import { CreateUserDto, ChangePasswordDto, LoginDto, VerifyDto, RefreshTokenDto } from './dto';

// Thời gian sống của Refresh Token: 7 ngày (ms)
const REFRESH_TOKEN_TTL_MS = 1 * 24 * 60 * 60 * 1000;

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  // Private helpers

  // Tạo raw token ngẫu nhiên 64 bytes (base64)
  private generateRawToken(): string {
    return crypto.randomBytes(64).toString('base64');
  }

  /** Hash token bằng SHA-256 — chỉ lưu hash vào DB */
  private hashToken(raw: string): string {
    return crypto.createHash('sha256').update(raw).digest('hex');
  }

  // Tạo cặp access + refresh token và lưu refresh vào DB.
  // Nếu truyền `oldTokenId` thì xoá token cũ trước (rotation).
  private async issueTokenPair(
    userId: string,
    role: string,
    oldTokenId?: string,
  ) {
    // 1. Cấp accessToken (JWT, ngắn hạn)
    const accessToken = this.jwtService.sign({ sub: userId, role });

    // 2. Decode để lấy thời hạn thực tế của accessToken
    const decoded = this.jwtService.decode(accessToken) as { exp: number };
    const accessExpiresAt = new Date(decoded.exp * 1000);

    // 3. Tạo raw refreshToken ngẫu nhiên và hash để lưu DB
    const rawRefreshToken = this.generateRawToken();
    const hashedRefreshToken = this.hashToken(rawRefreshToken);
    const refreshExpiresAt = new Date(Date.now() + REFRESH_TOKEN_TTL_MS);

    // 4. Nếu rotation: xóa token cũ
    if (oldTokenId) {
      await this.prisma.refreshToken.delete({ where: { id: oldTokenId } });
    }

    // 5. Lưu refresh token mới vào DB
    await this.prisma.refreshToken.create({
      data: {
        token: hashedRefreshToken,
        userId,
        expiresAt: refreshExpiresAt,
      },
    });

    return { accessToken, accessExpiresAt, rawRefreshToken, refreshExpiresAt };
  }

  // Public methods

  // Đăng ký tài khoản
  async register(createUserDto: CreateUserDto) {
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

    const { accessToken, accessExpiresAt, rawRefreshToken, refreshExpiresAt } =
      await this.issueTokenPair(user.id, user.role);

    return new ApiResponse(
      {
        accessToken,
        accessExpiresAt,
        refreshToken: rawRefreshToken,
        refreshExpiresAt,
        user: { id: user.id, email: user.email, role: user.role },
      },
      'Đăng nhập thành công',
    );
  }

  // Làm mới token — nhận refreshToken cũ, trả cặp token mới (rotation).
  // Token cũ bị xóa ngay sau khi dùng → phát hiện reuse attack.
  async refreshTokens(dto: RefreshTokenDto) {
    const hashed = this.hashToken(dto.refreshToken);

    const stored = await this.prisma.refreshToken.findUnique({
      where: { token: hashed },
      include: { user: true },
    });

    if (!stored) {
      throw new UnauthorizedException('Refresh token không hợp lệ');
    }
    if (stored.isRevoked) {
      // Token bị revoke → có thể bị lộ, xóa toàn bộ session của user
      await this.prisma.refreshToken.deleteMany({ where: { userId: stored.userId } });
      throw new UnauthorizedException('Refresh token đã bị thu hồi. Vui lòng đăng nhập lại.');
    }
    if (stored.expiresAt < new Date()) {
      await this.prisma.refreshToken.delete({ where: { id: stored.id } });
      throw new UnauthorizedException('Refresh token đã hết hạn. Vui lòng đăng nhập lại.');
    }

    // Rotation: xóa token cũ, cấp cặp token mới
    const { accessToken, accessExpiresAt, rawRefreshToken, refreshExpiresAt } =
      await this.issueTokenPair(stored.user.id, stored.user.role, stored.id);

    return new ApiResponse(
      {
        accessToken,
        accessExpiresAt,
        refreshToken: rawRefreshToken,
        refreshExpiresAt,
        user: { id: stored.user.id, email: stored.user.email, role: stored.user.role },
      },
      'Cấp token mới thành công',
    );
  }

  // Đăng xuất — revoke refreshToken trong DB
  async logout(dto: RefreshTokenDto) {
    const hashed = this.hashToken(dto.refreshToken);

    const stored = await this.prisma.refreshToken.findUnique({
      where: { token: hashed },
    });

    if (stored) {
      await this.prisma.refreshToken.delete({ where: { id: stored.id } });
    }
    // Trả 200 dù token không tồn tại (idempotent)

    return new ApiResponse(null, 'Đăng xuất thành công');
  }

  // Xác thực token — dành cho Gateway
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

  // Cập nhật thông tin profile
  async updateProfile(userId: string, dto: any) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException('Không tìm thấy người dùng');
    }

    const updatedUser = await this.prisma.user.update({
      where: { id: userId },
      data: dto,
      select: { id: true, email: true, fullName: true, phone: true, address: true, role: true, createdAt: true },
    });

    return new ApiResponse(updatedUser, 'Cập nhật hồ sơ thành công');
  }

  // Thống kê dành cho Admin
  async getStats() {
    const totalUsers = await this.prisma.user.count();
    const totalOwners = await this.prisma.user.count({ where: { role: 'OWNER' } });
    const totalTenants = await this.prisma.user.count({ where: { role: 'TENANT' } });

    return new ApiResponse({ totalUsers, totalOwners, totalTenants }, 'Thống kê người dùng');
  }
}

import { Injectable, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  // có thể ghi đè phương thức handleRequest để tùy chỉnh thông báo lỗi
  handleRequest(err, user, info) {
    if (err || !user) {
      throw err || new UnauthorizedException('Bạn cần đăng nhập để thực hiện thao tác này');
    }
    return user;
  }
}
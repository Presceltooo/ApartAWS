import { createParamDecorator, ExecutionContext } from '@nestjs/common';

/**
 * Decorator để lấy thông tin User từ header do Gateway forward.
 * Gateway đã xác thực JWT và gán:
 *  - x-user-id: userId
 *  - x-user-role: role
 *
 * Cách dùng: @CurrentUser() user: GatewayUser
 *            @CurrentUser('userId') userId: string
 */
export interface GatewayUser {
  userId: string;
  role: string;
}

export const CurrentUser = createParamDecorator(
  (field: keyof GatewayUser | undefined, ctx: ExecutionContext): GatewayUser | string => {
    const request = ctx.switchToHttp().getRequest();
    const user: GatewayUser = {
      userId: request.headers['x-user-id'] as string,
      role: request.headers['x-user-role'] as string,
    };
    return field ? user[field] : user;
  },
);

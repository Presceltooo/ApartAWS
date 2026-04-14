import { createParamDecorator, ExecutionContext } from '@nestjs/common';

/**
 * Lấy thông tin User từ header do API Gateway inject sau khi verify JWT.
 * Gateway gán:
 *  - x-user-id: userId
 *  - x-user-role: role
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

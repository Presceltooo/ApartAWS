import { Injectable, NestMiddleware, UnauthorizedException } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import type { Request, Response, NextFunction } from 'express';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  constructor(private httpService: HttpService) {}

  async use(req: Request, res: Response, next: NextFunction) {
    const token = req.headers.authorization?.replace('Bearer ', '');
    // If there is no token, let it pass to proxy (it might be a public route that we didn't exclude, and the backend service will reject it)
    if (!token) {
      return next();
    }

    try {
      // Use AUTH_SERVICE_URL or fallback to docker service name
      const targetBaseUrl = process.env.AUTH_SERVICE_URL || 'http://auth-service:3001';
      
      const { data } = await firstValueFrom(
        this.httpService.post(`${targetBaseUrl}/api/Auth/verify`, { token })
      );
      
      // Inject user info into headers so that the downstream services can read it
      req.headers['x-user-id'] = data.data.userId;
      req.headers['x-user-role'] = data.data.role;
      next();
    } catch (error) {
      throw new UnauthorizedException('Invalid or expired token');
    }
  }
}

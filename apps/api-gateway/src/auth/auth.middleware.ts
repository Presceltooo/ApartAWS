import { Injectable, NestMiddleware, UnauthorizedException } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import type { Request, Response, NextFunction } from 'express';
import { firstValueFrom } from 'rxjs';

function isPublicRoute(method: string, url: string): boolean {
  // Extract path, remove trailing slash and query params, normalize to lowercase
  const path = url.split('?')[0].replace(/\/$/, '').toLowerCase();
  
  if (method === 'POST') {
    return [
      '/api/auth/login',
      '/api/auth/register',
      '/api/auth/refresh',
      '/api/auth/logout',
      '/api/auth/forgot-password',
      '/api/auth/reset-password'
    ].includes(path);
  }
  
  if (method === 'GET') {
    if (path === '/api/apartments/listing') return true;
    if (path === '/api/bookings/check-availability') return true;
    if (path === '/api/payments/vnpay-ipn') return true;
    if (path === '/api/payments/vnpay-return') return true;
    
    // GET /api/apartments/:id
    // Must be /api/apartments/<something> where <something> is not stats, system/all, system/auto-approve, etc.
    const apartmentsMatch = path.match(/^\/api\/apartments\/([^/]+)$/);
    if (apartmentsMatch) {
      const id = apartmentsMatch[1];
      if (['stats', 'system'].includes(id)) {
        return false;
      }
      return true;
    }
  }
  
  return false;
}

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  constructor(private httpService: HttpService) {}

  async use(req: Request, res: Response, next: NextFunction) {
    const isPublic = isPublicRoute(req.method, req.originalUrl || req.url);
    let token = req.headers.authorization?.replace('Bearer ', '');

    if (!token && req.query.token) {
      token = req.query.token as string;
    }

    if (!token) {
      if (isPublic) {
        return next();
      }
      throw new UnauthorizedException('Authentication token is missing');
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
      req.headers['x-user-email'] = data.data.email;
      next();
    } catch (error) {
      if (isPublic) {
        return next();
      }
      throw new UnauthorizedException('Invalid or expired token');
    }
  }
}

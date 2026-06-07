import { Controller, All, Req, Res } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import type { Request, Response } from 'express';
import { firstValueFrom } from 'rxjs';

// Routing map: path prefix → service base URL (env var)
const SERVICE_MAP: { prefix: string; envKey: string; default: string }[] = [
  { prefix: '/api/auth',          envKey: 'AUTH_SERVICE_URL',          default: 'http://auth-service:3001' },
  { prefix: '/api/payments',      envKey: 'PAYMENT_SERVICE_URL',       default: 'http://payment-service:3005' },
  { prefix: '/api/bookings',      envKey: 'BOOKING_SERVICE_URL',       default: 'http://booking-service:3003' },
  { prefix: '/api/apartments',    envKey: 'APARTMENT_SERVICE_URL',     default: 'http://apartment-service:3002' },
  { prefix: '/api/notifications', envKey: 'NOTIFICATION_SERVICE_URL',  default: 'http://notification-service:3004' },
  { prefix: '/api/Auth',          envKey: 'AUTH_SERVICE_URL',          default: 'http://auth-service:3001' },
  { prefix: '/api/Payments',      envKey: 'PAYMENT_SERVICE_URL',       default: 'http://payment-service:3005' },
  { prefix: '/api/Bookings',      envKey: 'BOOKING_SERVICE_URL',       default: 'http://booking-service:3003' },
  { prefix: '/api/Apartments',    envKey: 'APARTMENT_SERVICE_URL',     default: 'http://apartment-service:3002' },
  { prefix: '/api/Notifications', envKey: 'NOTIFICATION_SERVICE_URL',  default: 'http://notification-service:3004' },
];

function resolveTarget(path: string): string {
  for (const rule of SERVICE_MAP) {
    if (path.startsWith(rule.prefix)) {
      return process.env[rule.envKey] || rule.default;
    }
  }
  // Default fallback → apartment-service
  return process.env.APARTMENT_SERVICE_URL || 'http://apartment-service:3002';
}

@Controller('api')
export class ProxyController {
  constructor(private httpService: HttpService) {}

  @All('*')
  async proxy(@Req() req: Request, @Res() res: Response) {
    let path = req.originalUrl;
    
    // Rewrite legacy/incorrect VNPay return routes from booking-service to payment-service
    const lowerPath = path.toLowerCase();
    if (lowerPath.startsWith('/api/bookings/payments/vnpay-')) {
      path = path.replace(/^\/api\/bookings\/payments\/vnpay-/i, '/api/payments/vnpay-');
    }

    const targetBaseUrl = resolveTarget(path);
    const targetUrl = `${targetBaseUrl}${path}`;

    try {
      const response = await firstValueFrom(
        this.httpService.request({
          url: targetUrl,
          method: req.method,
          data: req.body,
          headers: {
            ...req.headers,
            host: undefined, // remove host header to avoid conflicts
          },
          maxRedirects: 0, // Cực kỳ quan trọng: Không tự động follow redirect
          validateStatus: (status) => status < 400 || status === 302, // Chấp nhận cả mã 302
        }),
      );

      // Forward response headers
      for (const [key, value] of Object.entries(response.headers)) {
        res.setHeader(key, value as string | string[]);
      }

      res.status(response.status).send(response.data);
    } catch (error: any) {
      if (error.response) {
        res.status(error.response.status).send(error.response.data);
      } else {
        res.status(500).json({ message: 'Gateway Proxy Error', error: error.message });
      }
    }
  }
}

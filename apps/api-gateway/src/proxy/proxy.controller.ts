import { Controller, All, Req, Res } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import type { Request, Response } from 'express';
import { firstValueFrom } from 'rxjs';

// Routing map: path prefix → service base URL (env var)
const SERVICE_MAP: { prefix: string; envKey: string; default: string }[] = [
  { prefix: '/api/Auth',       envKey: 'AUTH_SERVICE_URL',      default: 'http://auth-service:3001' },
  { prefix: '/api/Bookings',   envKey: 'BOOKING_SERVICE_URL',   default: 'http://booking-service:3003' },
  { prefix: '/api/Apartments', envKey: 'APARTMENT_SERVICE_URL', default: 'http://apartment-service:3002' },
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
    const path = req.originalUrl;
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

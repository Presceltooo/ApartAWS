import { Controller, All, Req, Res } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import type { Request, Response } from 'express';
import { firstValueFrom } from 'rxjs';

@Controller('api')
export class ProxyController {
  constructor(private httpService: HttpService) {}

  @All('*')
  async proxy(@Req() req: Request, @Res() res: Response) {
    // Determine the target URL. 
    // In Phase 1, we only have the monolith (apartment-service).
    // In later phases, we will route based on the path.
    const path = req.originalUrl;
    
    // Default monolith url (e.g. apartment-service internally in docker)
    let targetBaseUrl = process.env.APARTMENT_SERVICE_URL || 'http://localhost:3001';

    // Phase 1 just proxies everything to the monolith.
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
            // 'x-user-id' and 'x-user-role' are injected by AuthMiddleware
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

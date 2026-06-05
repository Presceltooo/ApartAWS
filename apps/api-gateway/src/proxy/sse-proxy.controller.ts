import { Controller, Get, Req, Res, Logger } from '@nestjs/common';
import type { Request, Response } from 'express';
import * as http from 'http';
import * as url from 'url';

@Controller('api/notifications/sse')
export class SseProxyController {
  private readonly logger = new Logger(SseProxyController.name);

  @Get('stream')
  async proxySSE(@Req() req: Request, @Res() res: Response) {
    const notificationServiceUrl =
      process.env.NOTIFICATION_SERVICE_URL || 'http://notification-service:3004';
    
    const targetUrl = `${notificationServiceUrl}/api/notifications/sse/stream`;
    const parsedUrl = new url.URL(targetUrl);

    this.logger.log(`Proxying SSE request to: ${targetUrl}`);

    // Set SSE headers immediately to prevent buffering and establish the event-stream
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');
    res.setHeader('X-Accel-Buffering', 'no'); // Disable buffering on Nginx/Reverse proxies
    res.flushHeaders();

    // Make the backend request using Node's http module to pipe response directly
    const proxyReq = http.request(
      {
        hostname: parsedUrl.hostname,
        port: parsedUrl.port,
        path: parsedUrl.pathname,
        method: 'GET',
        headers: {
          // Forward the authenticated headers parsed by API Gateway AuthMiddleware
          'x-user-id': req.headers['x-user-id'] as string || '',
          'x-user-role': req.headers['x-user-role'] as string || '',
          'x-user-email': req.headers['x-user-email'] as string || '',
          'Accept': 'text/event-stream',
          'Cache-Control': 'no-cache',
        },
      },
      (proxyRes) => {
        this.logger.log(`SSE proxy connected, status: ${proxyRes.statusCode}`);
        // Pipe the backend response stream directly to the client response stream
        proxyRes.pipe(res);
      },
    );

    proxyReq.on('error', (err) => {
      this.logger.error(`SSE proxy connection error: ${err.message}`);
      if (!res.headersSent) {
        res.status(502).json({ message: 'SSE Proxy Error', error: err.message });
      } else {
        res.end();
      }
    });

    // Cleanup backend connection if the client disconnects
    req.on('close', () => {
      this.logger.log('SSE client disconnected, closing backend connection');
      proxyReq.destroy();
    });

    proxyReq.end();
  }
}

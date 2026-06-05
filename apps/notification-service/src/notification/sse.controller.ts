import { Controller, Sse, Req, Res, Logger } from '@nestjs/common';
import { Observable } from 'rxjs';
import type { Request, Response } from 'express';
import { SseGatewayService } from './sse-gateway.service';
import { CurrentUser, GatewayUser } from '../common/decorators/user.decorator';

@Controller('notifications/sse')
export class SseController {
  private readonly logger = new Logger(SseController.name);

  constructor(private readonly sseGateway: SseGatewayService) {}

  /**
   * SSE endpoint — FE connects here using EventSource.
   * Route: GET /api/notifications/sse/stream
   */
  @Sse('stream')
  stream(
    @CurrentUser() user: GatewayUser,
    @Req() req: Request,
    @Res() res: Response,
  ): Observable<MessageEvent> {
    const userId = user.userId;
    this.logger.log(`SSE stream request received for user: ${userId}`);

    // Clean up when the connection is closed
    req.on('close', () => {
      this.logger.log(`SSE connection closed by request for user: ${userId}`);
      this.sseGateway.unsubscribe(userId);
    });

    return this.sseGateway.subscribe(userId);
  }
}

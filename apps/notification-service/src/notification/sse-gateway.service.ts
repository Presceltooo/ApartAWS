import { Injectable, Logger, OnModuleDestroy } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { Subject, Observable, interval, merge } from 'rxjs';
import { filter, map } from 'rxjs/operators';

export interface SseNotificationEvent {
  userId: string;
  data: {
    type: 'new-notification' | 'unread-count-changed' | 'heartbeat';
    notification?: any;
    unreadCount?: number;
    timestamp?: number;
  };
}

@Injectable()
export class SseGatewayService implements OnModuleDestroy {
  private readonly logger = new Logger(SseGatewayService.name);

  // Subject to broadcast all events
  private readonly eventSubject = new Subject<SseNotificationEvent>();

  // Map to track connection counts per user
  private readonly connections = new Map<string, number>();

  private readonly MAX_CONNECTIONS_PER_USER = 5;

  onModuleDestroy() {
    this.eventSubject.complete();
  }

  /**
   * Subscribe a user to their notification stream.
   * Merges heartbeat events to keep connection alive.
   */
  subscribe(userId: string): Observable<MessageEvent> {
    const count = (this.connections.get(userId) || 0) + 1;
    this.connections.set(userId, count);

    if (count > this.MAX_CONNECTIONS_PER_USER) {
      this.logger.warn(`User ${userId} exceeded max SSE connections (${count}/${this.MAX_CONNECTIONS_PER_USER})`);
    } else {
      this.logger.log(`User ${userId} connected via SSE (total connections: ${count})`);
    }

    // Heartbeat every 30s to keep proxy/load balancer connection alive
    const heartbeat$ = interval(30000).pipe(
      map(() => ({
        data: JSON.stringify({ type: 'heartbeat', timestamp: Date.now() }),
        type: 'heartbeat',
      } as unknown as MessageEvent)),
    );

    const notifications$ = this.eventSubject.asObservable().pipe(
      filter((event) => event.userId === userId),
      map((event) => ({
        data: JSON.stringify(event.data),
        type: event.data.type,
      } as unknown as MessageEvent)),
    );

    return merge(notifications$, heartbeat$);
  }

  /**
   * Clean up when a connection is closed
   */
  unsubscribe(userId: string) {
    const count = Math.max(0, (this.connections.get(userId) || 1) - 1);
    if (count === 0) {
      this.connections.delete(userId);
    } else {
      this.connections.set(userId, count);
    }
    this.logger.log(`User ${userId} disconnected from SSE (remaining: ${count})`);
  }

  /**
   * Handle 'notification.created' events emitted by NotificationService
   */
  @OnEvent('notification.created')
  handleNotificationCreated(payload: { userId: string; notification: any; unreadCount: number }) {
    this.logger.log(`Emitting SSE new-notification event for user ${payload.userId}`);
    
    this.eventSubject.next({
      userId: payload.userId,
      data: {
        type: 'new-notification',
        notification: payload.notification,
        unreadCount: payload.unreadCount,
      },
    });
  }
}

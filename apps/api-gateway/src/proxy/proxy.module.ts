import { Module, MiddlewareConsumer, RequestMethod } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { ProxyController } from './proxy.controller';
import { AuthMiddleware } from '../auth/auth.middleware';

@Module({
  imports: [HttpModule],
  controllers: [ProxyController],
})
export class ProxyModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AuthMiddleware)
      .forRoutes('*');
  }
}

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
      // Exclude routes that don't need token verification
      .exclude(
        { path: 'api/Auth/login', method: RequestMethod.POST },
        { path: 'api/Auth/register', method: RequestMethod.POST },
        { path: 'api/Auth/refresh', method: RequestMethod.POST },
        { path: 'api/Auth/logout', method: RequestMethod.POST },
        { path: 'api/Apartments/listing', method: RequestMethod.GET },
        { path: 'api/Apartments/:id', method: RequestMethod.GET },
        { path: 'api/Bookings/check-availability', method: RequestMethod.GET }
      )
      .forRoutes('*');
  }
}

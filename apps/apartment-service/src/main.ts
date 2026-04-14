import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { TransformInterceptor } from './common/interceptors/transform.interceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();

  // Global prefix: tất cả API sẽ có dạng /api/...
  app.setGlobalPrefix('api');

  // Ap dung Interceptor cho moi API
  app.useGlobalInterceptors(new TransformInterceptor());

  // Cấu hình Swagger
  const config = new DocumentBuilder()
    .setTitle('Apartment Management API')
    .setDescription('Hệ thống quản lý căn hộ - Cloud Native AWS')
    .addBearerAuth()
    .addApiKey({ type: 'apiKey', in: 'header', name: 'x-user-id', description: 'User ID từ Gateway' }, 'x-user-id')
    .addApiKey({ type: 'apiKey', in: 'header', name: 'x-user-role', description: 'Role từ Gateway (ADMIN | OWNER | TENANT)' }, 'x-user-role')
    .setVersion('1.0')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  // Swagger UI sẽ chạy tại: http://localhost:PORT/api/docs
  SwaggerModule.setup('api/docs', app, document);

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();

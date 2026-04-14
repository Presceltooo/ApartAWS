import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import { TransformInterceptor } from './common/interceptors/transform.interceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors();

  // Global prefix
  app.setGlobalPrefix('api');

  // Transform interceptor — chuẩn hóa response format
  app.useGlobalInterceptors(new TransformInterceptor());

  // Validation
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));

  // Swagger
  const config = new DocumentBuilder()
    .setTitle('Booking Service API')
    .setDescription('Tài liệu API cho Microservice Quản Lý Đặt Phòng')
    .setVersion('1.0')
    .addApiKey({ type: 'apiKey', in: 'header', name: 'x-user-id' }, 'x-user-id')
    .addApiKey({ type: 'apiKey', in: 'header', name: 'x-user-role' }, 'x-user-role')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  await app.listen(process.env.PORT ?? 3003);
}
bootstrap();

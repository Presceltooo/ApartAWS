import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { TransformInterceptor } from './common/interceptors/transform.interceptor';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  app.enableCors();
  
  // Global prefix cho tất cả route
  app.setGlobalPrefix('api');

  // Áp dụng TransformInterceptor (format chuẩn response: { statusCode, message, data })
  app.useGlobalInterceptors(new TransformInterceptor());

  // Bật Validation (nếu có dùng class-validator ở DTO)
  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));

  // Cấu hình Swagger API Docs
  const config = new DocumentBuilder()
    .setTitle('Auth Service API')
    .setDescription('Tài liệu API cho Microservice Xác Thực & Quản Lý Người Dùng')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
    
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();

import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors(); // Thêm dòng này để cho phép React gọi API

  // Cấu hình Swagger
  const config = new DocumentBuilder()
    .setTitle('Apartment Management API')
    .setDescription('Hệ thống quản lý căn hộ - Cloud Native AWS')
    .setVersion('1.0')
    .addTag('apartments')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document); // Đường dẫn truy cập: localhost:3000/api/docs

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();

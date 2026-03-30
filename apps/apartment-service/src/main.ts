import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { TransformInterceptor } from './common/interceptors/transform.interceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors(); 

  // Ap dung Interceptor cho moi API
  app.useGlobalInterceptors(new TransformInterceptor());

  // Cấu hình Swagger
  const config = new DocumentBuilder()
    .setTitle('Apartment Management API')
    .setDescription('Hệ thống quản lý căn hộ - Cloud Native AWS')
    .addBearerAuth() 
    .setVersion('1.0')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document); 

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();

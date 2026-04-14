import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // Enable CORS so the React app can communicate with the Gateway
  app.enableCors();
  
  // Note: we don't set a global prefix here because the ProxyController 
  // explicitly listens to /api/* 
  
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();

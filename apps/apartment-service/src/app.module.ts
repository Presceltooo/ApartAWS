import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm/dist/typeorm.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST || 'localhost',
      port: process.env.DB_PORT ? parseInt(process.env.DB_PORT) : 5432,
      username: process.env.DB_USERNAME || 'user',
      password: process.env.DB_PASSWORD || 'password',
      database: process.env.DB_NAME || 'apart_booking',
      autoLoadEntities: true,
      synchronize: true, // Chỉ dùng khi dev, nó sẽ tự tạo bảng trong DB cho bạn
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

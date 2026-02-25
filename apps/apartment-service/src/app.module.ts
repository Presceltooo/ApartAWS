import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm/dist/typeorm.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'user',
      password: 'password',
      database: 'apart_booking',
      autoLoadEntities: true,
      synchronize: true, // Chỉ dùng khi dev, nó sẽ tự tạo bảng trong DB cho bạn
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

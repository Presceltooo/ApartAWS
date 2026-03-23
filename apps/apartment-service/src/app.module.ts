import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ApartmentsModule } from './modules/apartment/apartment.module';
import { PrismaModule } from './common/prisma/prisma.module';

@Module({
  imports: [
    PrismaModule,
    ApartmentsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

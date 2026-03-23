import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../common/prisma/prisma.service';
import { CreateApartmentDto } from './dto/create-apartment.dto';

@Injectable()
export class ApartmentsService {
  constructor(private prisma: PrismaService) {}

  // Lấy tất cả căn hộ
  findAll() {
    return this.prisma.apartment.findMany();
  }

  findById(id: string) {
    return this.prisma.apartment.findUnique({
      where: { id },
    });
  }

  // Tạo căn hộ mới
  create(createApartmentDto: CreateApartmentDto) {
    return this.prisma.apartment.create({
      data: createApartmentDto,
    });
  }

  findListing() {
    return this.prisma.apartment.findMany({
      where: {
        isActive: true,
      },
    });
  }
}

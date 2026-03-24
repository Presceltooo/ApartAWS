import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../common/prisma/prisma.service';
import { CreateApartmentDto, UpdateApartmentDto } from './dto';

@Injectable()
export class ApartmentsService {
  constructor(private prisma: PrismaService) {}

  // Lấy tất cả căn hộ
  findAll() {
    return this.prisma.apartment.findMany();
  }

  // Lấy chi tiết căn hộ
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

  // Chỉnh sửa thông tin căn 
  update(id: string, updateApartmentDto: UpdateApartmentDto) {
    return this.prisma.apartment.update({
      where: { id },
      data: updateApartmentDto,
    });
  }

  // Lấy danh sách căn hộ
  findListing() {
    return this.prisma.apartment.findMany({
      where: {
        isActive: true,
      },
    });
  }
}

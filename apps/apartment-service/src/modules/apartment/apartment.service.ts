import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../common/prisma/prisma.service';
import { CreateApartmentDto, UpdateApartmentDto } from './dto';
import { paginate } from 'src/common/utils/prisma-paginator';

@Injectable()
export class ApartmentsService {
  constructor(private prisma: PrismaService) {}

  // Lấy tất cả căn hộ
  async findAll(keyword?: string, page: number = 1, pageSize: number = 10) {
    return paginate(this.prisma.apartment, { page, pageSize }, {
      where: { keyword_: keyword?.trim() },
      orderBy: { createdAt: 'desc' }
    });
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

  // Xoá căn hộ
  remove(id: string) {
    return this.prisma.apartment.delete({
      where: { id },
    });
  }

  // Lấy danh sách căn hộ
  findListing(Keyword?: string, Page: number = 1, PageSize: number = 10) {
    return paginate(this.prisma.apartment, { page: Page, pageSize: PageSize }, {
      where: {
        isActive: true,
        keyword_: Keyword?.trim(),
      },
      orderBy: { createdAt: 'desc' },
    });
  }
}

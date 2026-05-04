import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../common/prisma/prisma.service';
import { ApiResponse } from '../common/dto/response.dto';
import { CreateApartmentDto, UpdateApartmentDto } from './dto';
import { paginate } from '../common/utils/prisma-paginator';

@Injectable()
export class ApartmentsService {
  constructor(private prisma: PrismaService) {}

  // Lấy danh sách căn hộ của một Owner
  async findAll(ownerId: string, keyword?: string, page: number = 1, pageSize: number = 10) {
    const where: any = { ownerId };
    
    if (keyword?.trim()) {
      where.title = { contains: keyword.trim(), mode: 'insensitive' as const };
    }

    const result = await paginate(this.prisma.apartment, { page, pageSize }, {
      where,
      orderBy: { createdAt: 'desc' }
    });

    return new ApiResponse(result.data, 'Lấy danh sách căn hộ thành công', 0, result.metaData);
  }

  // Lấy chi tiết căn hộ
  async findById(id: string) {
    const apartment = await this.prisma.apartment.findUnique({
      where: { id }
    });
    
    if (!apartment) throw new NotFoundException('Không tìm thấy căn hộ');
    
    return new ApiResponse(apartment, 'Lấy chi tiết căn hộ thành công');
  }

  // Tạo căn hộ mới
  async create(createApartmentDto: CreateApartmentDto, ownerId: string) {
    const apartment = await this.prisma.apartment.create({
      data: {
        ...createApartmentDto,
        ownerId,
      },
    });
    return new ApiResponse(apartment, 'Tạo căn hộ thành công');
  }

  // Chỉnh sửa thông tin căn hộ
  async update(id: string, updateApartmentDto: UpdateApartmentDto, userId: string) {
    const apartment = await this.prisma.apartment.findUnique({ where: { id } });
    
    if (!apartment) throw new NotFoundException('Không tìm thấy căn hộ');
    if (apartment.ownerId !== userId) throw new ForbiddenException('Bạn không có quyền chỉnh sửa căn hộ này');

    const updated = await this.prisma.apartment.update({
      where: { id },
      data: updateApartmentDto,
    });

    return new ApiResponse(updated, 'Cập nhật căn hộ thành công');
  }

  // Xoá căn hộ
  async remove(id: string, userId: string) {
    const apartment = await this.prisma.apartment.findUnique({ where: { id } });

    if (!apartment) throw new NotFoundException('Không tìm thấy căn hộ');
    if (apartment.ownerId !== userId) throw new ForbiddenException('Bạn không có quyền xoá căn hộ này');

    await this.prisma.apartment.delete({
      where: { id },
    });

    return new ApiResponse(null, 'Xoá căn hộ thành công');
  }

  // Lấy danh sách căn hộ active (Dành cho khách xem) có hỗ trợ filter
  async findListing(
    Keyword?: string, 
    Page: number = 1, 
    PageSize: number = 10,
    MinPrice?: number,
    MaxPrice?: number,
    Location?: string
  ) {
    const where: any = { isActive: true };

    if (Keyword?.trim()) {
      where.title = { contains: Keyword.trim(), mode: 'insensitive' as const };
    }

    if (Location?.trim()) {
      where.location = { contains: Location.trim(), mode: 'insensitive' as const };
    }

    if (MinPrice !== undefined || MaxPrice !== undefined) {
      where.pricePerNight = {};
      if (MinPrice !== undefined) where.pricePerNight.gte = MinPrice;
      if (MaxPrice !== undefined) where.pricePerNight.lte = MaxPrice;
    }

    const result = await paginate(this.prisma.apartment, { page: Page, pageSize: PageSize }, {
      where,
      orderBy: { createdAt: 'desc' },
    });

    return new ApiResponse(result.data, 'Lấy danh sách listing thành công', 0, result.metaData);
  }

  // Thống kê dành cho Admin
  async getStats() {
    const totalApartments = await this.prisma.apartment.count();
    const activeApartments = await this.prisma.apartment.count({ where: { isActive: true } });

    return new ApiResponse({ totalApartments, activeApartments }, 'Thống kê căn hộ');
  }
}

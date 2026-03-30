import { ConflictException, Injectable, ForbiddenException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../common/prisma/prisma.service';
import { ApiResponse } from '../../common/dto/response.dto';
import { paginate } from '../../common/utils/prisma-paginator';
import { CreateBookingDto, CancelBookingDto } from './dto';

@Injectable()
export class BookingsService {
  constructor(private prisma: PrismaService) {}

  // Tạo đơn đặt phòng
  async create(createBookingDto: CreateBookingDto, tenantId: string) {
    const { available } = await this.checkAvailability(
      createBookingDto.apartmentId,
      createBookingDto.startDate,
      createBookingDto.endDate,
    );

    if (!available) {
      throw new ConflictException('Căn hộ đã được đặt trong khoảng thời gian này');
    }

    const booking = await this.prisma.booking.create({
      data: {
        ...createBookingDto,
        tenantId,
        startDate: new Date(createBookingDto.startDate),
        endDate: new Date(createBookingDto.endDate),
      },
      include: { apartment: true },
    });

    return new ApiResponse(booking, 'Đặt phòng thành công');
  }

  // Khách thuê xem lịch sử đặt phòng của mình
  async findMyBookings(tenantId: string, keyword?: string, page: number = 1, pageSize: number = 10) {
    const where: any = {
      tenantId,
    };

    if (keyword?.trim()) {
      where.apartment = {
        title: { contains: keyword.trim(), mode: 'insensitive' as const },
      };
    }

    const result = await paginate(this.prisma.booking, { page, pageSize }, {
      where,
      include: { apartment: true },
      orderBy: { createdAt: 'desc' as const },
    });

    return new ApiResponse(result.data, 'Lấy danh sách đặt phòng thành công', 0, result.metaData);
  }

  // Chủ nhà xem danh sách booking của các căn hộ mình sở hữu
  async findByOwner(ownerId: string, keyword?: string, page: number = 1, pageSize: number = 10) {
    const where: any = {
      apartment: { ownerId },
    };

    if (keyword?.trim()) {
      where.apartment = {
        ...where.apartment,
        title: { contains: keyword.trim(), mode: 'insensitive' as const },
      };
    }

    const result = await paginate(this.prisma.booking, { page, pageSize }, {
      where,
      include: { apartment: true },
      orderBy: { createdAt: 'desc' as const },
    });

    return new ApiResponse(result.data, 'Lấy danh sách booking của chủ nhà thành công', 0, result.metaData);
  }

  // Xem chi tiết 1 booking
  async findById(id: string, userId: string) {
    const booking = await this.prisma.booking.findUnique({
      where: { id },
      include: { apartment: true },
    });

    if (!booking) throw new NotFoundException('Không tìm thấy đơn đặt phòng');

    if (booking.tenantId !== userId && booking.apartment.ownerId !== userId) {
      throw new ForbiddenException('Bạn không có quyền xem thông tin đặt phòng này');
    }

    return new ApiResponse(booking, 'Lấy chi tiết đặt phòng thành công');
  }

  // Hủy đặt phòng
  async cancel(id: string, userId: string) {
    const booking = await this.prisma.booking.findUnique({
      where: { id },
      include: { apartment: true },
    });

    if (!booking) throw new NotFoundException('Không tìm thấy đơn đặt phòng');

    if (booking.tenantId !== userId && booking.apartment.ownerId !== userId) {
      throw new ForbiddenException('Bạn không có quyền hủy đơn đặt phòng này');
    }

    const updated = await this.prisma.booking.update({
      where: { id },
      data: {
        status: 'CANCELLED',
      },
      include: { apartment: true },
    });

    return new ApiResponse(updated, 'Hủy đặt phòng thành công');
  }

  // Kiểm tra căn hộ có trống trong khoảng ngày không
  async checkAvailability(apartmentId: string, startDate: string, endDate: string) {
    const conflicting = await this.prisma.booking.findFirst({
      where: {
        apartmentId,
        status: { notIn: ['CANCELLED'] },
        startDate: { lte: new Date(endDate) },
        endDate: { gte: new Date(startDate) },
      },
    });

    return { available: !conflicting };
  }
}

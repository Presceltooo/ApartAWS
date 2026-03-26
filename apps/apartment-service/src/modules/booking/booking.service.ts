import { ConflictException, Injectable } from '@nestjs/common';
import { PrismaService } from '../../common/prisma/prisma.service';
import { paginate } from '../../common/utils/prisma-paginator';
import { CreateBookingDto, CancelBookingDto } from './dto';

@Injectable()
export class BookingsService {
  constructor(private prisma: PrismaService) {}

  // Tạo đơn đặt phòng (có kiểm tra trùng ngày)
  async create(createBookingDto: CreateBookingDto) {
    // Kiểm tra xem căn hộ có trống trong khoảng ngày này không
    const { available } = await this.checkAvailability(
      createBookingDto.apartmentId,
      createBookingDto.startDate,
      createBookingDto.endDate,
    );

    if (!available) {
      throw new ConflictException('Căn hộ đã được đặt trong khoảng thời gian này');
    }

    return this.prisma.booking.create({
      data: createBookingDto,
      include: { apartment: true },
    });
  }

  // Khách thuê xem lịch sử đặt phòng
  async findAll(keyword?: string, page: number = 1, pageSize: number = 10) {
    const where = keyword?.trim()
      ? {
          apartment: { title: { contains: keyword.trim(), mode: 'insensitive' as const } },
        }
      : undefined;

    return paginate(this.prisma.booking, { page, pageSize }, {
      where,
      include: { apartment: true },
      orderBy: { createdAt: 'desc' as const },
    });
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

    return paginate(this.prisma.booking, { page, pageSize }, {
      where,
      include: { apartment: true },
      orderBy: { createdAt: 'desc' as const },
    });
  }

  // Xem chi tiết 1 booking
  async findById(id: string) {
    return this.prisma.booking.findUnique({
      where: { id },
      include: { apartment: true },
    });
  }

  // Hủy đặt phòng — chỉ đổi status, không cho FE ghi đè field khác
  async cancel(id: string, cancelBookingDto: CancelBookingDto) {
    return this.prisma.booking.update({
      where: { id },
      data: {
        status: 'CANCELLED',
      },
      include: { apartment: true },
    });
  }

  // Kiểm tra căn hộ có trống trong khoảng ngày không → trả về { available: boolean }
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

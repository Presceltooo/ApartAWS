import {
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { PrismaService } from '../common/prisma/prisma.service';
import { ApiResponse } from '../common/dto/response.dto';
import { paginate } from '../common/utils/prisma-paginator';
import { CreateBookingDto } from './dto/create-booking.dto';

@Injectable()
export class BookingsService {
  constructor(
    private prisma: PrismaService,
    private httpService: HttpService,
  ) {}

  // ===========================================================================
  // Tạo đơn đặt phòng
  // Gọi HTTP sang Apartment Service để kiểm tra căn hộ có tồn tại & còn active
  // ===========================================================================
  async create(dto: CreateBookingDto, tenantId: string) {
    if (!tenantId) {
      throw new ForbiddenException('Bạn phải đăng nhập để đặt phòng');
    }

    // 1. Kiểm tra apartment tồn tại (gọi inter-service HTTP)
    const apartment = await this.getApartment(dto.apartmentId);
    if (!apartment) {
      throw new NotFoundException('Không tìm thấy căn hộ');
    }
    if (!apartment.isActive) {
      throw new ConflictException('Căn hộ hiện không có sẵn để đặt');
    }

    // 2. Kiểm tra lịch trống
    const { available } = await this.checkAvailability(
      dto.apartmentId,
      dto.startDate,
      dto.endDate,
    );
    if (!available) {
      throw new ConflictException('Căn hộ đã được đặt trong khoảng thời gian này');
    }

    // Tính số đêm (nights)
    const start = new Date(dto.startDate);
    const end = new Date(dto.endDate);
    const msDiff = end.getTime() - start.getTime();
    const nights = Math.max(1, Math.round(msDiff / (1000 * 60 * 60 * 24)));

    // Lấy giá trị nguyên từ Decimal / string
    const pricePerNight = Number(apartment.pricePerNight || 0);
    const totalPrice = pricePerNight * nights;

    try {
      // 3. Tạo booking
      const booking = await this.prisma.booking.create({
        data: {
          ...dto,
          tenantId,
          totalPrice,
          startDate: start,
          endDate: end,
        },
      });

      // 4. Merge thông tin apartment vào response (Convert Decimal -> number cho frontend)
      return new ApiResponse(
        { 
          ...booking, 
          totalPrice: Number(booking.totalPrice),
          apartment 
        }, 
        'Đặt phòng thành công'
      );
    } catch (error) {
      console.error('Create booking error:', error);
      throw error; // Rethrow to let NestJS handle it, but now we've logged it (if we could see logs)
    }
  }

  // ===========================================================================
  // Khách thuê xem lịch sử đặt phòng của mình
  // ===========================================================================
  async findMyBookings(
    tenantId: string,
    keyword?: string,
    page: number = 1,
    pageSize: number = 10,
  ) {
    const where: any = { tenantId };

    const result = await paginate(this.prisma.booking, { page, pageSize }, {
      where,
      orderBy: { createdAt: 'desc' as const },
    });

    // Enrich với thông tin apartment
    const enriched = await this.enrichBookingsWithApartment(result.data, keyword);
    return new ApiResponse(enriched, 'Lấy danh sách đặt phòng thành công', 0, result.metaData);
  }

  // ===========================================================================
  // Chủ nhà xem danh sách booking của các căn hộ mình sở hữu
  // ===========================================================================
  async findByOwner(
    ownerId: string,
    keyword?: string,
    page: number = 1,
    pageSize: number = 10,
  ) {
    // Lấy tất cả apartmentId mà owner này sở hữu
    const apartments = await this.getApartmentsByOwner(ownerId);
    const apartmentIds = apartments.map((a: any) => a.id);

    if (apartmentIds.length === 0) {
      return new ApiResponse([], 'Lấy danh sách booking thành công');
    }

    const where: any = { apartmentId: { in: apartmentIds } };

    const result = await paginate(this.prisma.booking, { page, pageSize }, {
      where,
      orderBy: { createdAt: 'desc' as const },
    });

    const enriched = await this.enrichBookingsWithApartment(result.data, keyword);
    return new ApiResponse(enriched, 'Lấy danh sách booking của chủ nhà thành công', 0, result.metaData);
  }

  // ===========================================================================
  // Xem chi tiết 1 booking
  // ===========================================================================
  async findById(id: string, userId: string) {
    const booking = await this.prisma.booking.findUnique({ where: { id } });
    if (!booking) throw new NotFoundException('Không tìm thấy đơn đặt phòng');

    const apartment = await this.getApartment(booking.apartmentId);

    // Kiểm tra quyền: chỉ tenant hoặc owner căn hộ
    if (booking.tenantId !== userId && apartment?.ownerId !== userId) {
      throw new ForbiddenException('Bạn không có quyền xem thông tin đặt phòng này');
    }

    return new ApiResponse({ ...booking, apartment }, 'Lấy chi tiết đặt phòng thành công');
  }

  // ===========================================================================
  // Hủy đặt phòng
  // ===========================================================================
  async cancel(id: string, userId: string) {
    const booking = await this.prisma.booking.findUnique({ where: { id } });
    if (!booking) throw new NotFoundException('Không tìm thấy đơn đặt phòng');

    const apartment = await this.getApartment(booking.apartmentId);

    if (booking.tenantId !== userId && apartment?.ownerId !== userId) {
      throw new ForbiddenException('Bạn không có quyền hủy đơn đặt phòng này');
    }

    const updated = await this.prisma.booking.update({
      where: { id },
      data: { status: 'CANCELLED' },
    });

    return new ApiResponse({ ...updated, apartment }, 'Hủy đặt phòng thành công');
  }

  // ===========================================================================
  // Xác nhận đặt phòng (Owner)
  // ===========================================================================
  async confirm(id: string, userId: string) {
    const booking = await this.prisma.booking.findUnique({ where: { id } });
    if (!booking) throw new NotFoundException('Không tìm thấy đơn đặt phòng');

    const apartment = await this.getApartment(booking.apartmentId);

    if (apartment?.ownerId !== userId) {
      throw new ForbiddenException('Chỉ chủ nhà mới có quyền xác nhận đơn đặt phòng này');
    }

    if (booking.status !== 'PENDING') {
      throw new ConflictException('Chỉ có thể xác nhận đơn đặt phòng đang chờ xử lý');
    }

    const updated = await this.prisma.booking.update({
      where: { id },
      data: { status: 'CONFIRMED' },
    });

    return new ApiResponse({ ...updated, apartment }, 'Xác nhận đặt phòng thành công');
  }

  // ===========================================================================
  // Hoàn thành đặt phòng (Owner)
  // ===========================================================================
  async complete(id: string, userId: string) {
    const booking = await this.prisma.booking.findUnique({ where: { id } });
    if (!booking) throw new NotFoundException('Không tìm thấy đơn đặt phòng');

    const apartment = await this.getApartment(booking.apartmentId);

    if (apartment?.ownerId !== userId) {
      throw new ForbiddenException('Chỉ chủ nhà mới có quyền hoàn thành đơn đặt phòng này');
    }

    if (booking.status !== 'CONFIRMED') {
      throw new ConflictException('Chỉ có thể hoàn thành đơn đặt phòng đã xác nhận');
    }

    const updated = await this.prisma.booking.update({
      where: { id },
      data: { status: 'COMPLETED' },
    });

    return new ApiResponse({ ...updated, apartment }, 'Hoàn thành đặt phòng thành công');
  }

  // ===========================================================================
  // Kiểm tra căn hộ có trống trong khoảng ngày không (public)
  // ===========================================================================
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

  // ===========================================================================
  // PRIVATE — Gọi HTTP sang Apartment Service
  // ===========================================================================
  private async getApartment(apartmentId: string): Promise<any> {
    try {
      const { data } = await firstValueFrom(
        this.httpService.get(
          `${process.env.APARTMENT_SERVICE_URL}/api/Apartments/${apartmentId}`,
        ),
      );
      return data?.data ?? data;
    } catch {
      return null;
    }
  }

  private async getApartmentsByOwner(ownerId: string): Promise<any[]> {
    try {
      const { data } = await firstValueFrom(
        this.httpService.get(
          `${process.env.APARTMENT_SERVICE_URL}/api/Apartments?ownerId=${ownerId}&PageSize=1000`,
        ),
      );
      return data?.data ?? [];
    } catch {
      return [];
    }
  }

  private async enrichBookingsWithApartment(bookings: any[], keyword?: string): Promise<any[]> {
    const enriched = await Promise.all(
      bookings.map(async (b) => {
        const apartment = await this.getApartment(b.apartmentId);
        return { ...b, apartment };
      }),
    );

    // Filter theo keyword nếu có
    if (keyword?.trim()) {
      const kw = keyword.trim().toLowerCase();
      return enriched.filter((b) =>
        b.apartment?.title?.toLowerCase().includes(kw),
      );
    }
    return enriched;
  }
}

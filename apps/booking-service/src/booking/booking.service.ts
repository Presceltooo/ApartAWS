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
import { SqsProducerService } from '../common/sqs/sqs-producer.service';
import { NotificationEventType } from '../common/sqs/notification-event.interface';

@Injectable()
export class BookingsService {
  constructor(
    private prisma: PrismaService,
    private httpService: HttpService,
    private sqsProducer: SqsProducerService,
  ) {}

  // ===========================================================================
  // Tạo đơn đặt phòng
  // Gọi HTTP sang Apartment Service để kiểm tra căn hộ có tồn tại & còn active
  // ===========================================================================
  async create(dto: CreateBookingDto, tenantId: string, tenantEmail?: string) {
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

    // 3. Tính số đêm
    const start = new Date(dto.startDate);
    const end = new Date(dto.endDate);
    const msDiff = end.getTime() - start.getTime();
    const nights = Math.max(1, Math.round(msDiff / (1000 * 60 * 60 * 24)));

    // 4. Xác định totalPrice:
    //    - Ưu tiên dùng giá từ frontend (đã bao gồm phí vệ sinh, phí dịch vụ, v.v.)
    //    - Nếu frontend không gửi, tính cơ bản: pricePerNight × nights
    const pricePerNight = Number(apartment.pricePerNight || 0);
    const totalPrice = dto.totalPrice != null && dto.totalPrice > 0
      ? dto.totalPrice
      : pricePerNight * nights;

    try {
      // 5. Tạo booking với totalPrice chính xác
      const isAuto = !!apartment.isAutoApprove;
      const booking = await this.prisma.booking.create({
        data: {
          apartmentId: dto.apartmentId,
          startDate: start,
          endDate: end,
          tenantId,
          totalPrice,
          status: isAuto ? 'CONFIRMED' : 'PENDING',
        },
      });

      // Gửi email thông báo qua SQS (bất đồng bộ, fat event)
      const tenant = await this.getUser(tenantId).catch(() => null);
      const tenantEmailVal = tenantEmail || tenant?.email;
      const tenantName = tenant?.fullName || tenant?.username || 'Khách hàng';

      const owner = apartment.ownerId ? await this.getUser(apartment.ownerId).catch(() => null) : null;
      const ownerEmail = owner?.email;
      const ownerName = owner?.fullName || owner?.username || 'Chủ nhà';

      this.sqsProducer.publishNotification({
        eventType: NotificationEventType.BOOKING_CREATED,
        timestamp: new Date().toISOString(),
        payload: {
          bookingId: booking.id,
          apartmentId: apartment.id,
          apartmentTitle: apartment.title,
          tenantId,
          tenantEmail: tenantEmailVal,
          tenantName,
          ownerId: apartment.ownerId,
          ownerEmail,
          ownerName,
          startDate: start.toISOString(),
          endDate: end.toISOString(),
          nights,
          totalPrice: Number(totalPrice),
          bookingStatus: booking.status,
          paymentStatus: booking.paymentStatus,
        },
      }).catch(err => console.error('SQS publish error (BOOKING_CREATED):', err));

      // 6. Merge thông tin apartment vào response (Convert Decimal → number cho frontend)
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
      throw error;
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

    // Publish event BOOKING_CANCELLED to SQS
    const tenant = await this.getUser(updated.tenantId).catch(() => null);
    const owner = apartment?.ownerId ? await this.getUser(apartment.ownerId).catch(() => null) : null;
    const start = new Date(updated.startDate);
    const end = new Date(updated.endDate);
    const msDiff = end.getTime() - start.getTime();
    const nights = Math.max(1, Math.round(msDiff / (1000 * 60 * 60 * 24)));

    this.sqsProducer.publishNotification({
      eventType: NotificationEventType.BOOKING_CANCELLED,
      timestamp: new Date().toISOString(),
      payload: {
        bookingId: updated.id,
        apartmentId: updated.apartmentId,
        apartmentTitle: apartment?.title || 'Căn hộ',
        tenantId: updated.tenantId,
        tenantEmail: tenant?.email,
        tenantName: tenant?.fullName || tenant?.username,
        ownerId: apartment?.ownerId,
        ownerEmail: owner?.email,
        ownerName: owner?.fullName || owner?.username,
        startDate: updated.startDate.toISOString(),
        endDate: updated.endDate.toISOString(),
        nights,
        totalPrice: Number(updated.totalPrice),
        bookingStatus: updated.status,
        paymentStatus: updated.paymentStatus,
      },
    }).catch(err => console.error('SQS publish error (BOOKING_CANCELLED):', err));

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

    // Publish event BOOKING_CONFIRMED to SQS
    const tenant = await this.getUser(updated.tenantId).catch(() => null);
    const owner = apartment?.ownerId ? await this.getUser(apartment.ownerId).catch(() => null) : null;
    const start = new Date(updated.startDate);
    const end = new Date(updated.endDate);
    const msDiff = end.getTime() - start.getTime();
    const nights = Math.max(1, Math.round(msDiff / (1000 * 60 * 60 * 24)));

    this.sqsProducer.publishNotification({
      eventType: NotificationEventType.BOOKING_CONFIRMED,
      timestamp: new Date().toISOString(),
      payload: {
        bookingId: updated.id,
        apartmentId: updated.apartmentId,
        apartmentTitle: apartment?.title || 'Căn hộ',
        tenantId: updated.tenantId,
        tenantEmail: tenant?.email,
        tenantName: tenant?.fullName || tenant?.username,
        ownerId: apartment?.ownerId,
        ownerEmail: owner?.email,
        ownerName: owner?.fullName || owner?.username,
        startDate: updated.startDate.toISOString(),
        endDate: updated.endDate.toISOString(),
        nights,
        totalPrice: Number(updated.totalPrice),
        bookingStatus: updated.status,
        paymentStatus: updated.paymentStatus,
      },
    }).catch(err => console.error('SQS publish error (BOOKING_CONFIRMED):', err));

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

    // Publish event BOOKING_COMPLETED to SQS
    const tenant = await this.getUser(updated.tenantId).catch(() => null);
    const owner = apartment?.ownerId ? await this.getUser(apartment.ownerId).catch(() => null) : null;
    const start = new Date(updated.startDate);
    const end = new Date(updated.endDate);
    const msDiff = end.getTime() - start.getTime();
    const nights = Math.max(1, Math.round(msDiff / (1000 * 60 * 60 * 24)));

    this.sqsProducer.publishNotification({
      eventType: NotificationEventType.BOOKING_COMPLETED,
      timestamp: new Date().toISOString(),
      payload: {
        bookingId: updated.id,
        apartmentId: updated.apartmentId,
        apartmentTitle: apartment?.title || 'Căn hộ',
        tenantId: updated.tenantId,
        tenantEmail: tenant?.email,
        tenantName: tenant?.fullName || tenant?.username,
        ownerId: apartment?.ownerId,
        ownerEmail: owner?.email,
        ownerName: owner?.fullName || owner?.username,
        startDate: updated.startDate.toISOString(),
        endDate: updated.endDate.toISOString(),
        nights,
        totalPrice: Number(updated.totalPrice),
        bookingStatus: updated.status,
        paymentStatus: updated.paymentStatus,
      },
    }).catch(err => console.error('SQS publish error (BOOKING_COMPLETED):', err));

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

  // ===========================================================================
  // Thống kê dành cho Chủ nhà (Owner)
  // ===========================================================================
  async getOwnerStats(ownerId: string, year?: number, month?: number) {
    const apartments = await this.getApartmentsByOwner(ownerId);
    const apartmentIds = apartments.map((a: any) => a.id);

    if (apartmentIds.length === 0) {
      return new ApiResponse({
        totalBookings: 0,
        pendingBookings: 0,
        confirmedBookings: 0,
        completedBookings: 0,
        cancelledBookings: 0,
        totalRevenue: 0,
        chartData: [],
      }, 'Thống kê trống (chưa có căn hộ)');
    }

    const where: any = {
      apartmentId: { in: apartmentIds },
    };

    if (year) {
      if (month) {
        const startOfMonth = new Date(Date.UTC(year, month - 1, 1, 0, 0, 0, 0));
        const endOfMonth = new Date(Date.UTC(year, month, 0, 23, 59, 59, 999));
        where.startDate = {
          gte: startOfMonth,
          lte: endOfMonth,
        };
      } else {
        const startOfYear = new Date(Date.UTC(year, 0, 1, 0, 0, 0, 0));
        const endOfYear = new Date(Date.UTC(year, 11, 31, 23, 59, 59, 999));
        where.startDate = {
          gte: startOfYear,
          lte: endOfYear,
        };
      }
    }

    const bookings = await this.prisma.booking.findMany({
      where,
    });

    const totalBookings = bookings.length;
    const pendingBookings = bookings.filter(b => b.status === 'PENDING').length;
    const confirmedBookings = bookings.filter(b => b.status === 'CONFIRMED').length;
    const completedBookings = bookings.filter(b => b.status === 'COMPLETED').length;
    const cancelledBookings = bookings.filter(b => b.status === 'CANCELLED').length;

    const revenueBookings = bookings.filter(b => b.status === 'CONFIRMED' || b.status === 'COMPLETED');
    const totalRevenue = revenueBookings.reduce((sum, b) => sum + Number(b.totalPrice), 0);

    const chartData: { label: string; revenue: number; bookings: number }[] = [];

    if (year && month) {
      const daysInMonth = new Date(year, month, 0).getDate();
      for (let day = 1; day <= daysInMonth; day++) {
        const dayRevBookings = revenueBookings.filter(b => {
          const d = new Date(b.startDate);
          return d.getUTCFullYear() === year && (d.getUTCMonth() + 1) === month && d.getUTCDate() === day;
        });
        const dayAllBookings = bookings.filter(b => {
          const d = new Date(b.startDate);
          return d.getUTCFullYear() === year && (d.getUTCMonth() + 1) === month && d.getUTCDate() === day;
        });
        const rev = dayRevBookings.reduce((sum, b) => sum + Number(b.totalPrice), 0);
        chartData.push({
          label: `${day}/${month}`,
          revenue: rev,
          bookings: dayAllBookings.length,
        });
      }
    } else if (year) {
      for (let m = 1; m <= 12; m++) {
        const monthRevBookings = revenueBookings.filter(b => {
          const d = new Date(b.startDate);
          return d.getUTCFullYear() === year && (d.getUTCMonth() + 1) === m;
        });
        const monthAllBookings = bookings.filter(b => {
          const d = new Date(b.startDate);
          return d.getUTCFullYear() === year && (d.getUTCMonth() + 1) === m;
        });
        const rev = monthRevBookings.reduce((sum, b) => sum + Number(b.totalPrice), 0);
        chartData.push({
          label: `Tháng ${m}`,
          revenue: rev,
          bookings: monthAllBookings.length,
        });
      }
    } else {
      const currentYear = new Date().getFullYear();
      for (let y = currentYear - 4; y <= currentYear; y++) {
        const yearRevBookings = revenueBookings.filter(b => {
          const d = new Date(b.startDate);
          return d.getUTCFullYear() === y;
        });
        const yearAllBookings = bookings.filter(b => {
          const d = new Date(b.startDate);
          return d.getUTCFullYear() === y;
        });
        const rev = yearRevBookings.reduce((sum, b) => sum + Number(b.totalPrice), 0);
        chartData.push({
          label: `Năm ${y}`,
          revenue: rev,
          bookings: yearAllBookings.length,
        });
      }
    }

    return new ApiResponse({
      totalBookings,
      pendingBookings,
      confirmedBookings,
      completedBookings,
      cancelledBookings,
      totalRevenue,
      chartData,
    }, 'Thống kê chủ nhà thành công');
  }

  // ===========================================================================
  // Thống kê dành cho Admin
  // ===========================================================================
  async getStats() {
    const totalBookings = await this.prisma.booking.count();
    const pendingBookings = await this.prisma.booking.count({ where: { status: 'PENDING' } });
    
    // Tính tổng doanh thu (chỉ tính những booking đã CONFIRMED hoặc COMPLETED)
    const revenueResult = await this.prisma.booking.aggregate({
      _sum: { totalPrice: true },
      where: { status: { in: ['CONFIRMED', 'COMPLETED'] } },
    });
    
    const totalRevenue = revenueResult._sum.totalPrice ? Number(revenueResult._sum.totalPrice) : 0;

    return new ApiResponse({ totalBookings, pendingBookings, totalRevenue }, 'Thống kê đơn đặt phòng');
  }

  // ===========================================================================
  // Quản lý Đặt phòng (Dành cho System Admin)
  // ===========================================================================
  async findAllSystem(keyword?: string, page: number = 1, pageSize: number = 10) {
    const result = await paginate(this.prisma.booking, { page, pageSize }, {
      orderBy: { createdAt: 'desc' },
    });

    const enriched = await this.enrichBookingsWithApartment(result.data, keyword);
    return new ApiResponse(enriched, 'Lấy danh sách toàn bộ đặt phòng thành công', 0, result.metaData);
  }

  async updateBookingStatusSystem(id: string, status: any) {
    const booking = await this.prisma.booking.findUnique({ where: { id } });
    if (!booking) throw new NotFoundException('Không tìm thấy đơn đặt phòng');

    const updated = await this.prisma.booking.update({
      where: { id },
      data: { status },
    });

    const apartment = await this.getApartment(booking.apartmentId);

    return new ApiResponse({ ...updated, apartment }, 'Cập nhật trạng thái đặt phòng (Admin) thành công');
  }

  private async getUser(userId: string): Promise<any> {
    try {
      const authServiceUrl = process.env.AUTH_SERVICE_URL || 'http://auth-service:3001';
      const { data } = await firstValueFrom(
        this.httpService.get(
          `${authServiceUrl}/api/auth/users/${userId}`,
        ),
      );
      return data?.data ?? data;
    } catch (err: any) {
      console.error(`Error fetching user ${userId} from auth-service:`, err.message);
      return null;
    }
  }
}

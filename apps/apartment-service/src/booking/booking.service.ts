import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from '../common/prisma/prisma.service';
import { ApiResponse } from '../common/dto/response.dto';
import { CreateBookingDto } from './dto';
import { paginate } from '../common/utils/prisma-paginator';
import { BookingStatus } from '../common/constants';

@Injectable()
export class BookingService {
  constructor(private prisma: PrismaService) {}

  /**
   * POST /bookings — Tạo booking mới (Tenant)
   */
  async createBooking(dto: CreateBookingDto, tenantId: string) {
    const { apartmentId, startDate, endDate, totalPrice } = dto;

    // Kiểm tra căn hộ tồn tại
    const apartment = await this.prisma.apartment.findUnique({
      where: { id: apartmentId },
    });
    if (!apartment) {
      throw new NotFoundException('Không tìm thấy căn hộ');
    }
    if (!apartment.isActive) {
      throw new BadRequestException('Căn hộ này hiện không nhận đặt phòng');
    }

    const start = new Date(startDate);
    const end = new Date(endDate);

    if (isNaN(start.getTime()) || isNaN(end.getTime())) {
      throw new BadRequestException('Ngày không hợp lệ');
    }
    if (start >= end) {
      throw new BadRequestException('Ngày nhận phòng phải trước ngày trả phòng');
    }
    if (start < new Date()) {
      throw new BadRequestException('Ngày nhận phòng không được là ngày trong quá khứ');
    }

    // Kiểm tra xung đột booking
    const conflict = await this.prisma.booking.findFirst({
      where: {
        apartmentId,
        status: { in: ['CONFIRMED', 'PENDING'] },
        AND: [
          { startDate: { lt: end } },
          { endDate: { gt: start } },
        ],
      },
    });
    if (conflict) {
      throw new BadRequestException('Căn hộ đã được đặt trong khoảng thời gian này');
    }

    const booking = await this.prisma.booking.create({
      data: {
        apartmentId,
        tenantId,
        startDate: start,
        endDate: end,
        totalPrice,
        status: 'PENDING',
        paymentStatus: 'UNPAID',
      },
    });

    return new ApiResponse(booking, 'Đặt phòng thành công');
  }

  /**
   * GET /bookings/my-bookings — Lấy danh sách booking của Tenant
   */
  async getMyBookings(
    tenantId: string,
    keyword?: string,
    page: number = 1,
    pageSize: number = 10,
    status?: string,
  ) {
    const where: any = { tenantId };
    if (status) {
      where.status = status;
    }

    const result = await paginate(
      this.prisma.booking,
      { page, pageSize },
      {
        where,
        orderBy: { createdAt: 'desc' },
        include: {
          apartment: true,
        },
      },
    );

    return new ApiResponse(result.data, 'Lấy danh sách đặt phòng thành công', 0, result.metaData);
  }

  /**
   * GET /bookings/:id — Chi tiết một booking
   */
  async getBookingById(id: string, requesterId: string, requesterRole: string) {
    const booking = await (this.prisma.booking as any).findUnique({
      where: { id },
      include: { apartment: true },
    });
    if (!booking) throw new NotFoundException('Không tìm thấy đặt phòng');

    // Chỉ cho phép tenant sở hữu, owner của căn hộ, hoặc admin xem
    const isOwner = booking.apartment?.ownerId === requesterId;
    const isTenant = booking.tenantId === requesterId;
    const isAdmin = requesterRole === 'ADMIN';

    if (!isTenant && !isOwner && !isAdmin) {
      throw new ForbiddenException('Bạn không có quyền xem đặt phòng này');
    }

    return new ApiResponse(booking, 'Lấy chi tiết đặt phòng thành công');
  }

  /**
   * PATCH /bookings/:id/cancel — Huỷ booking (Tenant)
   */
  async cancelBooking(id: string, tenantId: string) {
    const booking = await this.prisma.booking.findUnique({ where: { id } });
    if (!booking) throw new NotFoundException('Không tìm thấy đặt phòng');
    if (booking.tenantId !== tenantId)
      throw new ForbiddenException('Bạn không có quyền huỷ đặt phòng này');
    if (booking.status === 'CANCELLED')
      throw new BadRequestException('Đặt phòng đã được huỷ');
    if (booking.status === 'COMPLETED')
      throw new BadRequestException('Không thể huỷ đặt phòng đã hoàn thành');

    const updated = await this.prisma.booking.update({
      where: { id },
      data: { status: 'CANCELLED' },
    });

    return new ApiResponse(updated, 'Đã huỷ đặt phòng');
  }

  /**
   * PATCH /bookings/:id/confirm — Xác nhận booking (Owner)
   */
  async confirmBooking(id: string, ownerId: string) {
    const booking = await (this.prisma.booking as any).findUnique({
      where: { id },
      include: { apartment: true },
    });
    if (!booking) throw new NotFoundException('Không tìm thấy đặt phòng');
    if (booking.apartment?.ownerId !== ownerId)
      throw new ForbiddenException('Bạn không có quyền xác nhận đặt phòng này');
    if (booking.status !== 'PENDING')
      throw new BadRequestException('Chỉ có thể xác nhận đặt phòng đang chờ');

    const updated = await this.prisma.booking.update({
      where: { id },
      data: { status: 'CONFIRMED' },
    });

    return new ApiResponse(updated, 'Đã xác nhận đặt phòng');
  }

  /**
   * PATCH /bookings/:id/complete — Hoàn thành booking (Owner)
   */
  async completeBooking(id: string, ownerId: string) {
    const booking = await (this.prisma.booking as any).findUnique({
      where: { id },
      include: { apartment: true },
    });
    if (!booking) throw new NotFoundException('Không tìm thấy đặt phòng');
    if (booking.apartment?.ownerId !== ownerId)
      throw new ForbiddenException('Bạn không có quyền hoàn thành đặt phòng này');
    if (booking.status !== 'CONFIRMED')
      throw new BadRequestException('Chỉ có thể hoàn thành đặt phòng đã xác nhận');

    const updated = await this.prisma.booking.update({
      where: { id },
      data: { status: 'COMPLETED' },
    });

    return new ApiResponse(updated, 'Đặt phòng đã hoàn thành');
  }

  /**
   * GET /bookings/check-availability — Kiểm tra lịch trống
   */
  async checkAvailability(apartmentId: string, startDate: string, endDate: string) {
    const start = new Date(startDate);
    const end = new Date(endDate);

    const conflict = await this.prisma.booking.findFirst({
      where: {
        apartmentId,
        status: { in: ['CONFIRMED', 'PENDING'] },
        AND: [{ startDate: { lt: end } }, { endDate: { gt: start } }],
      },
    });

    return new ApiResponse(
      { available: !conflict },
      conflict ? 'Căn hộ đã được đặt trong khoảng thời gian này' : 'Căn hộ còn trống',
    );
  }

  /**
   * GET /bookings — Lấy tất cả booking (Admin)
   */
  async getAllBookings(page: number = 1, pageSize: number = 10, status?: string) {
    const where: any = {};
    if (status) where.status = status;

    const result = await paginate(
      this.prisma.booking,
      { page, pageSize },
      {
        where,
        orderBy: { createdAt: 'desc' },
        include: { apartment: true },
      },
    );

    return new ApiResponse(result.data, 'Lấy danh sách đặt phòng (Admin)', 0, result.metaData);
  }
}

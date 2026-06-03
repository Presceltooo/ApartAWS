import { Injectable, NotFoundException, ForbiddenException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../common/prisma/prisma.service';
import { ApiResponse } from '../common/dto/response.dto';
import { CreateApartmentDto, UpdateApartmentDto, CreateReviewDto } from './dto';
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
      where: { id },
      include: {
        reviews: {
          orderBy: { createdAt: 'desc' },
        },
      },
    });
    
    if (!apartment) throw new NotFoundException('Không tìm thấy căn hộ');

    const tenantIds = apartment.reviews.map((r) => r.tenantId);
    const users = await this.prisma.user.findMany({
      where: { id: { in: tenantIds } },
      select: { id: true, fullName: true, email: true },
    });
    const userMap = new Map(users.map((u) => [u.id, u.fullName || u.email]));

    const reviewsWithNames = apartment.reviews.map((r) => ({
      ...r,
      tenantName: userMap.get(r.tenantId) || 'Khách hàng',
    }));

    const reviewCount = apartment.reviews.length;
    const averageRating = reviewCount > 0 
      ? Number((apartment.reviews.reduce((sum, r) => sum + r.rating, 0) / reviewCount).toFixed(2))
      : null;

    const result = {
      ...apartment,
      reviews: reviewsWithNames,
      reviewCount,
      averageRating,
    };
    
    return new ApiResponse(result, 'Lấy chi tiết căn hộ thành công');
  }

  // Tạo căn hộ mới
  async create(createApartmentDto: CreateApartmentDto, ownerId: string) {
    const autoApproveSetting = await this.prisma.systemSetting.findUnique({
      where: { key: 'auto_approve_apartments' },
    });
    const isActive = autoApproveSetting?.value === 'true';

    const apartment = await this.prisma.apartment.create({
      data: {
        ...createApartmentDto,
        ownerId,
        isActive,
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
    Location?: string,
    StartDate?: string,
    EndDate?: string
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

    if (StartDate && EndDate) {
      const start = new Date(StartDate);
      const end = new Date(EndDate);

      if (!isNaN(start.getTime()) && !isNaN(end.getTime())) {
        const conflictingBookings = await this.prisma.booking.findMany({
          where: {
            status: { in: ['CONFIRMED', 'PENDING'] },
            AND: [
              { startDate: { lt: end } },
              { endDate: { gt: start } }
            ]
          },
          select: {
            apartmentId: true
          }
        });

        const bookedApartmentIds = conflictingBookings.map(b => b.apartmentId);
        if (bookedApartmentIds.length > 0) {
          where.id = { notIn: bookedApartmentIds };
        }
      }
    }

    const result = await paginate(this.prisma.apartment, { page: Page, pageSize: PageSize }, {
      where,
      orderBy: { createdAt: 'desc' },
      include: {
        reviews: {
          select: { rating: true },
        },
      },
    });

    const dataWithRatings = result.data.map((apt: any) => {
      const reviewCount = apt.reviews?.length ?? 0;
      const averageRating = reviewCount > 0
        ? Number((apt.reviews.reduce((sum: number, r: any) => sum + r.rating, 0) / reviewCount).toFixed(2))
        : null;
      
      const { reviews, ...rest } = apt;
      return {
        ...rest,
        averageRating,
        reviewCount,
      };
    });

    return new ApiResponse(dataWithRatings, 'Lấy danh sách listing thành công', 0, result.metaData);
  }

  // Thống kê dành cho Admin
  async getStats() {
    const totalApartments = await this.prisma.apartment.count();
    const activeApartments = await this.prisma.apartment.count({ where: { isActive: true } });

    return new ApiResponse({ totalApartments, activeApartments }, 'Thống kê căn hộ');
  }

  // ===========================================================================
  // Quản lý Căn hộ (Dành cho System Admin)
  // ===========================================================================
  async findAllSystem(keyword?: string, page: number = 1, pageSize: number = 10) {
    const where: any = {};
    if (keyword?.trim()) {
      where.title = { contains: keyword.trim(), mode: 'insensitive' as const };
    }

    const result = await paginate(this.prisma.apartment, { page, pageSize }, {
      where,
      orderBy: { createdAt: 'desc' },
    });

    return new ApiResponse(result.data, 'Lấy danh sách căn hộ (System) thành công', 0, result.metaData);
  }

  async toggleApartmentStatus(id: string, isActive: boolean) {
    const apartment = await this.prisma.apartment.findUnique({ where: { id } });
    if (!apartment) throw new NotFoundException('Không tìm thấy căn hộ');

    const updated = await this.prisma.apartment.update({
      where: { id },
      data: { isActive },
    });

    return new ApiResponse(updated, isActive ? 'Đã phê duyệt (Active) căn hộ' : 'Đã ẩn (Inactive) căn hộ');
  }

  async getAutoApproveSetting() {
    const setting = await this.prisma.systemSetting.findUnique({
      where: { key: 'auto_approve_apartments' },
    });
    return new ApiResponse({ isAutoApprove: setting?.value === 'true' }, 'Lấy cấu hình tự động duyệt thành công');
  }

  async updateAutoApproveSetting(isAutoApprove: boolean) {
    const setting = await this.prisma.systemSetting.upsert({
      where: { key: 'auto_approve_apartments' },
      update: { value: isAutoApprove ? 'true' : 'false' },
      create: { key: 'auto_approve_apartments', value: isAutoApprove ? 'true' : 'false' },
    });
    return new ApiResponse({ isAutoApprove: setting.value === 'true' }, 'Cập nhật cấu hình tự động duyệt thành công');
  }

  async toggleAutoApproveStatus(id: string, isAutoApprove: boolean, userId: string) {
    const apartment = await this.prisma.apartment.findUnique({ where: { id } });
    if (!apartment) throw new NotFoundException('Không tìm thấy căn hộ');
    if (apartment.ownerId !== userId) {
      throw new ForbiddenException('Bạn không có quyền chỉnh sửa căn hộ này');
    }

    const updated = await this.prisma.apartment.update({
      where: { id },
      data: { isAutoApprove },
    });

    return new ApiResponse(updated, isAutoApprove ? 'Đã bật tự động duyệt booking' : 'Đã tắt tự động duyệt booking');
  }

  async createReview(apartmentId: string, dto: CreateReviewDto, tenantId: string) {
    const booking = await this.prisma.booking.findUnique({
      where: { id: dto.bookingId },
    });

    if (!booking) {
      throw new NotFoundException('Không tìm thấy thông tin đặt phòng');
    }

    if (booking.tenantId !== tenantId) {
      throw new ForbiddenException('Bạn không có quyền đánh giá lượt đặt phòng này');
    }

    if (booking.apartmentId !== apartmentId) {
      throw new BadRequestException('Mã đặt phòng không khớp với căn hộ này');
    }

    if (booking.status !== 'COMPLETED') {
      throw new BadRequestException('Chỉ có thể đánh giá lượt đặt phòng đã hoàn thành');
    }

    const existing = await this.prisma.review.findUnique({
      where: { bookingId: dto.bookingId },
    });

    if (existing) {
      throw new BadRequestException('Lượt đặt phòng này đã được đánh giá trước đó');
    }

    const review = await this.prisma.review.create({
      data: {
        apartmentId,
        tenantId,
        bookingId: dto.bookingId,
        rating: dto.rating,
        comment: dto.comment,
      },
    });

    return new ApiResponse(review, 'Đánh giá căn hộ thành công');
  }

  async findReviewsByApartment(apartmentId: string) {
    const reviews = await this.prisma.review.findMany({
      where: { apartmentId },
      orderBy: { createdAt: 'desc' },
    });

    const tenantIds = reviews.map((r) => r.tenantId);
    const users = await this.prisma.user.findMany({
      where: { id: { in: tenantIds } },
      select: { id: true, fullName: true, email: true },
    });

    const userMap = new Map(users.map((u) => [u.id, u.fullName || u.email]));

    const result = reviews.map((r) => ({
      ...r,
      tenantName: userMap.get(r.tenantId) || 'Khách hàng',
    }));

    return new ApiResponse(result, 'Lấy danh sách đánh giá thành công');
  }
}

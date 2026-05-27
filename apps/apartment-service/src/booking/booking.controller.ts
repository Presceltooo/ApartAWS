import {
  Controller,
  Get,
  Post,
  Patch,
  Body,
  Param,
  Query,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiQuery,
  ApiSecurity,
} from '@nestjs/swagger';
import { BookingService } from './booking.service';
import { CreateBookingDto } from './dto';
import { CurrentUser } from '../common/decorators/user.decorator';

@ApiTags('Bookings')
@ApiSecurity('x-user-id')
@ApiSecurity('x-user-role')
@Controller('bookings')
export class BookingController {
  constructor(private readonly bookingService: BookingService) {}

  /**
   * POST /bookings — Tạo đặt phòng mới (Tenant)
   */
  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Tạo đặt phòng mới' })
  @ApiResponse({ status: 201, description: 'Đặt phòng thành công' })
  createBooking(
    @Body() dto: CreateBookingDto,
    @CurrentUser('userId') tenantId: string,
  ) {
    return this.bookingService.createBooking(dto, tenantId);
  }

  /**
   * GET /bookings/check-availability — Kiểm tra lịch trống (public)
   */
  @Get('check-availability')
  @ApiOperation({ summary: 'Kiểm tra lịch trống của căn hộ' })
  @ApiQuery({ name: 'apartmentId', required: true })
  @ApiQuery({ name: 'startDate', required: true })
  @ApiQuery({ name: 'endDate', required: true })
  checkAvailability(
    @Query('apartmentId') apartmentId: string,
    @Query('startDate') startDate: string,
    @Query('endDate') endDate: string,
  ) {
    return this.bookingService.checkAvailability(apartmentId, startDate, endDate);
  }

  /**
   * GET /bookings/my-bookings — Lịch sử đặt phòng của Tenant
   */
  @Get('my-bookings')
  @ApiOperation({ summary: 'Lấy danh sách đặt phòng của tôi (Tenant)' })
  @ApiQuery({ name: 'Page', required: false })
  @ApiQuery({ name: 'PageSize', required: false })
  @ApiQuery({ name: 'Status', required: false, enum: ['PENDING', 'CONFIRMED', 'CANCELLED', 'COMPLETED'] })
  getMyBookings(
    @CurrentUser('userId') tenantId: string,
    @Query('Page') page?: string,
    @Query('PageSize') pageSize?: string,
    @Query('Status') status?: string,
  ) {
    return this.bookingService.getMyBookings(
      tenantId,
      undefined,
      page ? +page : 1,
      pageSize ? +pageSize : 10,
      status,
    );
  }

  /**
   * GET /bookings — Lấy tất cả booking (Admin)
   */
  @Get()
  @ApiOperation({ summary: 'Lấy tất cả đặt phòng (Admin)' })
  @ApiQuery({ name: 'Page', required: false })
  @ApiQuery({ name: 'PageSize', required: false })
  @ApiQuery({ name: 'Status', required: false })
  getAllBookings(
    @Query('Page') page?: string,
    @Query('PageSize') pageSize?: string,
    @Query('Status') status?: string,
  ) {
    return this.bookingService.getAllBookings(
      page ? +page : 1,
      pageSize ? +pageSize : 10,
      status,
    );
  }

  /**
   * GET /bookings/:id — Chi tiết một booking
   */
  @Get(':id')
  @ApiOperation({ summary: 'Lấy chi tiết đặt phòng' })
  getBookingById(
    @Param('id') id: string,
    @CurrentUser('userId') userId: string,
    @CurrentUser('role') role: string,
  ) {
    return this.bookingService.getBookingById(id, userId, role);
  }

  /**
   * PATCH /bookings/:id/cancel — Huỷ booking (Tenant)
   */
  @Patch(':id/cancel')
  @ApiOperation({ summary: 'Huỷ đặt phòng (Tenant)' })
  cancelBooking(
    @Param('id') id: string,
    @CurrentUser('userId') tenantId: string,
  ) {
    return this.bookingService.cancelBooking(id, tenantId);
  }

  /**
   * PATCH /bookings/:id/confirm — Xác nhận booking (Owner)
   */
  @Patch(':id/confirm')
  @ApiOperation({ summary: 'Xác nhận đặt phòng (Owner)' })
  confirmBooking(
    @Param('id') id: string,
    @CurrentUser('userId') ownerId: string,
  ) {
    return this.bookingService.confirmBooking(id, ownerId);
  }

  /**
   * PATCH /bookings/:id/complete — Hoàn thành booking (Owner)
   */
  @Patch(':id/complete')
  @ApiOperation({ summary: 'Hoàn thành đặt phòng (Owner)' })
  completeBooking(
    @Param('id') id: string,
    @CurrentUser('userId') ownerId: string,
  ) {
    return this.bookingService.completeBooking(id, ownerId);
  }
}

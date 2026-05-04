import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Query,
  Patch,
  HttpCode,
  HttpStatus,
  NotFoundException,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiQuery,
  ApiParam,
  ApiHeader,
  ApiSecurity,
} from '@nestjs/swagger';
import { BookingsService } from './booking.service';
import { CreateBookingDto, CancelBookingDto } from './dto';
import { CurrentUser } from '../common/decorators/user.decorator';

@ApiTags('Bookings')
@ApiSecurity('x-user-id')
@ApiSecurity('x-user-role')
@Controller('Bookings')
export class BookingsController {
  constructor(private readonly bookingsService: BookingsService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Tạo đơn đặt phòng — yêu cầu header x-user-id (Gateway)' })
  @ApiResponse({ status: 201, description: 'Đơn đặt phòng đã được tạo thành công' })
  @ApiResponse({ status: 404, description: 'Căn hộ không tồn tại' })
  @ApiResponse({ status: 409, description: 'Căn hộ đã được đặt trong khoảng thời gian này' })
  @ApiHeader({ name: 'x-user-id', required: true, description: 'UUID của tenant (do Gateway forward)' })
  create(@Body() dto: CreateBookingDto, @CurrentUser('userId') userId: string) {
    return this.bookingsService.create(dto, userId);
  }

  @Get('my-bookings')
  @ApiOperation({ summary: 'Khách thuê xem lịch sử đặt phòng của mình' })
  @ApiResponse({ status: 200, description: 'Danh sách đặt phòng (phân trang)' })
  @ApiQuery({ name: 'Keyword', required: false, type: String })
  @ApiQuery({ name: 'Page', required: false, type: Number })
  @ApiQuery({ name: 'PageSize', required: false, type: Number })
  @ApiHeader({ name: 'x-user-id', required: true })
  findMyBookings(
    @CurrentUser('userId') userId: string,
    @Query('Keyword') keyword?: string,
    @Query('Page') page?: string,
    @Query('PageSize') pageSize?: string,
  ) {
    return this.bookingsService.findMyBookings(userId, keyword, page ? +page : 1, pageSize ? +pageSize : 10);
  }

  @Get('owner')
  @ApiOperation({ summary: 'Chủ nhà xem danh sách booking của căn hộ mình sở hữu' })
  @ApiResponse({ status: 200, description: 'Danh sách booking (phân trang)' })
  @ApiQuery({ name: 'Keyword', required: false, type: String })
  @ApiQuery({ name: 'Page', required: false, type: Number })
  @ApiQuery({ name: 'PageSize', required: false, type: Number })
  @ApiHeader({ name: 'x-user-id', required: true })
  findByOwner(
    @CurrentUser('userId') userId: string,
    @Query('Keyword') keyword?: string,
    @Query('Page') page?: string,
    @Query('PageSize') pageSize?: string,
  ) {
    return this.bookingsService.findByOwner(userId, keyword, page ? +page : 1, pageSize ? +pageSize : 10);
  }

  @Get('check-availability')
  @ApiOperation({ summary: 'Kiểm tra căn hộ có trống trong khoảng ngày hay không (public)' })
  @ApiQuery({ name: 'apartmentId', required: true, type: String })
  @ApiQuery({ name: 'startDate', required: true, type: String, description: 'YYYY-MM-DD' })
  @ApiQuery({ name: 'endDate', required: true, type: String, description: 'YYYY-MM-DD' })
  checkAvailability(
    @Query('apartmentId') apartmentId: string,
    @Query('startDate') startDate: string,
    @Query('endDate') endDate: string,
  ) {
    return this.bookingsService.checkAvailability(apartmentId, startDate, endDate);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Xem chi tiết một đơn đặt phòng' })
  @ApiResponse({ status: 200, description: 'Chi tiết đơn đặt phòng' })
  @ApiResponse({ status: 404, description: 'Không tìm thấy đơn đặt phòng' })
  @ApiParam({ name: 'id', type: String })
  @ApiHeader({ name: 'x-user-id', required: true })
  async findById(@Param('id') id: string, @CurrentUser('userId') userId: string) {
    const booking = await this.bookingsService.findById(id, userId);
    if (!booking) throw new NotFoundException(`Booking with id "${id}" not found`);
    return booking;
  }

  @Patch(':id/cancel')
  @ApiOperation({ summary: 'Hủy đơn đặt phòng' })
  @ApiResponse({ status: 200, description: 'Đã hủy thành công' })
  @ApiParam({ name: 'id', type: String })
  @ApiHeader({ name: 'x-user-id', required: true })
  cancel(
    @Param('id') id: string,
    @Body() cancelBookingDto: CancelBookingDto,
    @CurrentUser('userId') userId: string,
  ) {
    return this.bookingsService.cancel(id, userId);
  }

  @Patch(':id/confirm')
  @ApiOperation({ summary: 'Chủ nhà xác nhận đơn đặt phòng' })
  @ApiResponse({ status: 200, description: 'Đã xác nhận thành công' })
  @ApiParam({ name: 'id', type: String })
  @ApiHeader({ name: 'x-user-id', required: true })
  confirm(@Param('id') id: string, @CurrentUser('userId') userId: string) {
    return this.bookingsService.confirm(id, userId);
  }

  @Patch(':id/complete')
  @ApiOperation({ summary: 'Chủ nhà hoàn thành đơn đặt phòng' })
  @ApiResponse({ status: 200, description: 'Đã hoàn thành thành công' })
  @ApiParam({ name: 'id', type: String })
  @ApiHeader({ name: 'x-user-id', required: true })
  complete(@Param('id') id: string, @CurrentUser('userId') userId: string) {
    return this.bookingsService.complete(id, userId);
  }

  @Get('system/stats')
  @ApiOperation({ summary: 'Lấy thống kê hệ thống (Admin)' })
  @ApiResponse({ status: 200, description: 'Trả về thống kê' })
  getStats() {
    return this.bookingsService.getStats();
  }

  @Get('system/all')
  @ApiOperation({ summary: 'Lấy danh sách toàn bộ đơn đặt phòng (Admin)' })
  @ApiQuery({ name: 'Keyword', required: false, type: String })
  @ApiQuery({ name: 'Page', required: false, type: Number })
  @ApiQuery({ name: 'PageSize', required: false, type: Number })
  findAllSystem(
    @Query('Keyword') keyword?: string,
    @Query('Page') page?: string,
    @Query('PageSize') pageSize?: string,
  ) {
    return this.bookingsService.findAllSystem(keyword, page ? +page : 1, pageSize ? +pageSize : 10);
  }

  @Patch('system/:id/status')
  @ApiOperation({ summary: 'Cập nhật trạng thái đơn đặt phòng (Admin)' })
  @ApiParam({ name: 'id', type: String })
  updateBookingStatusSystem(@Param('id') id: string, @Body() body: { status: string }) {
    return this.bookingsService.updateBookingStatusSystem(id, body.status as any);
  }
}

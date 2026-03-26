import { Controller, Get, Post, Body, Param, Query, Patch, HttpCode, HttpStatus, NotFoundException } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery, ApiParam } from '@nestjs/swagger';
import { BookingsService } from './booking.service';
import { CreateBookingDto, CancelBookingDto } from './dto';

@ApiTags('bookings')
@Controller('bookings')
export class BookingsController {
  constructor(private readonly bookingsService: BookingsService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Tạo đơn đặt phòng' })
  @ApiResponse({ status: 201, description: 'Đơn đặt phòng đã được tạo thành công' })
  @ApiResponse({ status: 409, description: 'Căn hộ đã được đặt trong khoảng thời gian này' })
  create(@Body() createBookingDto: CreateBookingDto) {
    return this.bookingsService.create(createBookingDto);
  }

  @Get('my-bookings')
  @ApiOperation({ summary: 'Khách thuê xem lịch sử đặt phòng của mình' })
  @ApiResponse({ status: 200, description: 'Trả về danh sách đơn đặt phòng (có phân trang)' })
  @ApiQuery({ name: 'Keyword', required: false, type: String, description: 'Tìm theo tên căn hộ' })
  @ApiQuery({ name: 'Page', required: false, type: Number })
  @ApiQuery({ name: 'PageSize', required: false, type: Number })
  findMyBookings(
    @Query('Keyword') keyword?: string,
    @Query('Page') page?: string,
    @Query('PageSize') pageSize?: string,
  ) {
    return this.bookingsService.findAll(keyword, page ? +page : 1, pageSize ? +pageSize : 10);
  }

  @Get('owner')
  @ApiOperation({ summary: 'Chủ nhà xem danh sách booking của các căn hộ mình sở hữu' })
  @ApiResponse({ status: 200, description: 'Trả về danh sách đơn đặt phòng (có phân trang)' })
  @ApiQuery({ name: 'ownerId', required: true, type: String, description: 'ID chủ nhà (từ Cognito)' })
  @ApiQuery({ name: 'Keyword', required: false, type: String, description: 'Tìm theo tên căn hộ' })
  @ApiQuery({ name: 'Page', required: false, type: Number })
  @ApiQuery({ name: 'PageSize', required: false, type: Number })
  findByOwner(
    @Query('ownerId') ownerId: string,
    @Query('Keyword') keyword?: string,
    @Query('Page') page?: string,
    @Query('PageSize') pageSize?: string,
  ) {
    return this.bookingsService.findByOwner(ownerId, keyword, page ? +page : 1, pageSize ? +pageSize : 10);
  }

  // Đặt check-availability TRƯỚC :id để NestJS không nhầm "check-availability" là id
  @Get('check-availability')
  @ApiOperation({ summary: 'Kiểm tra căn hộ có trống trong khoảng ngày hay không' })
  @ApiResponse({ status: 200, description: 'Trả về { available: true/false }' })
  @ApiQuery({ name: 'apartmentId', required: true, type: String })
  @ApiQuery({ name: 'startDate', required: true, type: String, description: 'DD-MM-YYYY' })
  @ApiQuery({ name: 'endDate', required: true, type: String, description: 'DD-MM-YYYY' })
  checkAvailability(
    @Query('apartmentId') apartmentId: string,
    @Query('startDate') startDate: string,
    @Query('endDate') endDate: string,
  ) {
    return this.bookingsService.checkAvailability(apartmentId, startDate, endDate);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Xem chi tiết một đơn đặt phòng' })
  @ApiResponse({ status: 200, description: 'Trả về thông tin chi tiết đơn đặt phòng' })
  @ApiResponse({ status: 404, description: 'Không tìm thấy đơn đặt phòng' })
  @ApiParam({ name: 'id', type: String })
  async findById(@Param('id') id: string) {
    const booking = await this.bookingsService.findById(id);
    if (!booking) {
      throw new NotFoundException(`Booking with id "${id}" not found`);
    }
    return booking;
  }

  @Patch(':id/cancel')
  @ApiOperation({ summary: 'Hủy đơn đặt phòng' })
  @ApiResponse({ status: 200, description: 'Đơn đặt phòng đã được hủy' })
  @ApiParam({ name: 'id', type: String })
  cancel(@Param('id') id: string, @Body() cancelBookingDto: CancelBookingDto) {
    return this.bookingsService.cancel(id, cancelBookingDto);
  }
}

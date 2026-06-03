import { Controller, Get, Post, Body, Param, Put, Delete, Query, HttpStatus, HttpCode, Patch, ForbiddenException } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery, ApiSecurity } from '@nestjs/swagger';
import { ApartmentsService } from './apartment.service';
import { CreateApartmentDto, UpdateApartmentDto, CreateReviewDto } from './dto';
import { S3Service } from '../common/s3/s3.service';
import { CurrentUser } from '../common/decorators/user.decorator';

@ApiTags('Apartments')
@ApiSecurity('x-user-id')
@ApiSecurity('x-user-role')
@Controller('apartments')
export class ApartmentsController {
  constructor(
    private readonly apartmentsService: ApartmentsService,
    private readonly s3Service: S3Service,
  ) {}

  @Get()
  @ApiOperation({ summary: 'Lấy danh sách căn hộ của Owner hiện tại' })
  @ApiResponse({ status: 200, description: 'Trả về mảng các căn hộ của owner' })
  @ApiQuery({ name: 'Keyword', required: false, type: String })
  @ApiQuery({ name: 'Page', required: false, type: String })
  @ApiQuery({ name: 'PageSize', required: false, type: String })
  findAll(
    @CurrentUser('userId') userId: string,
    @Query('Keyword') Keyword?: string, 
    @Query('Page') Page?: string, 
    @Query('PageSize') PageSize?: string
  ) {
    return this.apartmentsService.findAll(userId, Keyword, Page ? +Page : 1, PageSize ? +PageSize : 10);
  }

  @Get('listing')
  @ApiOperation({ summary: 'Lấy danh sách căn hộ active (public)' })
  @ApiResponse({ status: 200, description: 'Trả về danh sách căn hộ active' })
  @ApiQuery({ name: 'Keyword', required: false, type: String })
  @ApiQuery({ name: 'Page', required: false, type: String })
  @ApiQuery({ name: 'MinPrice', required: false, type: Number })
  @ApiQuery({ name: 'MaxPrice', required: false, type: Number })
  @ApiQuery({ name: 'Location', required: false, type: String })
  @ApiQuery({ name: 'StartDate', required: false, type: String })
  @ApiQuery({ name: 'EndDate', required: false, type: String })
  findListing(
    @Query('Keyword') keyword?: string, 
    @Query('Page') page?: string, 
    @Query('PageSize') pageSize?: string,
    @Query('MinPrice') minPrice?: string,
    @Query('MaxPrice') maxPrice?: string,
    @Query('Location') location?: string,
    @Query('StartDate') startDate?: string,
    @Query('EndDate') endDate?: string
  ) {
    return this.apartmentsService.findListing(
      keyword, 
      page ? +page : 1, 
      pageSize ? +pageSize : 10,
      minPrice ? +minPrice : undefined,
      maxPrice ? +maxPrice : undefined,
      location,
      startDate,
      endDate
    );
  }

  // @Get(':id')
  // @ApiOperation({ summary: 'Lấy chi tiết căn hộ' })
  // @ApiResponse({ status: 200, description: 'Trả về thông tin chi tiết căn hộ' })
  // findById(@Param('id') id: string) {
  //   return this.apartmentsService.findById(id);
  // }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Tạo căn hộ mới' })
  @ApiResponse({ status: 201, description: 'Căn hộ đã được tạo và lưu' })
  create(@Body() dto: CreateApartmentDto, @CurrentUser('userId') userId: string) {
    return this.apartmentsService.create(dto, userId);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Cập nhật thông tin căn hộ' })
  @ApiResponse({ status: 200, description: 'Căn hộ đã được cập nhật' })
  update(
    @Param('id') id: string,
    @Body() dto: UpdateApartmentDto,
    @CurrentUser('userId') userId: string,
  ) {
    return this.apartmentsService.update(id, dto, userId);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Xoá căn hộ' })
  @ApiResponse({ status: 200, description: 'Căn hộ đã được xoá' })
  remove(@Param('id') id: string, @CurrentUser('userId') userId: string) {
    return this.apartmentsService.remove(id, userId);
  }

  @Post('presigned-url')
  @ApiOperation({ summary: 'Lấy presigned URL để upload ảnh lên S3' })
  @ApiResponse({ status: 201, description: 'Trả về uploadUrl và publicUrl' })
  getPresignedUrl(
    @Body() body: { fileName: string; contentType: string; fileSize?: number },
  ) {
    return this.s3Service.generatePresignedUrl(body.fileName, body.contentType, body.fileSize);
  }
  @Get('stats')
  @ApiOperation({ summary: 'Lấy thống kê hệ thống (Admin)' })
  @ApiResponse({ status: 200, description: 'Trả về thống kê' })
  getStats(@CurrentUser('role') role: string) {
    if (role !== 'ADMIN') {
      throw new ForbiddenException('Bạn không có quyền thực hiện chức năng này');
    }
    return this.apartmentsService.getStats();
  }

  @Get('system/all')
  @ApiOperation({ summary: 'Lấy tất cả danh sách căn hộ (Admin)' })
  @ApiQuery({ name: 'Keyword', required: false, type: String })
  @ApiQuery({ name: 'Page', required: false, type: String })
  @ApiQuery({ name: 'PageSize', required: false, type: String })
  findAllSystem(
    @CurrentUser('role') role: string,
    @Query('Keyword') keyword?: string,
    @Query('Page') page?: string,
    @Query('PageSize') pageSize?: string,
  ) {
    if (role !== 'ADMIN') {
      throw new ForbiddenException('Bạn không có quyền thực hiện chức năng này');
    }
    return this.apartmentsService.findAllSystem(keyword, page ? +page : 1, pageSize ? +pageSize : 10);
  }

  @Get('system/auto-approve')
  @ApiOperation({ summary: 'Lấy cấu hình tự động duyệt căn hộ của hệ thống (Admin)' })
  getAutoApproveSetting(@CurrentUser('role') role: string) {
    if (role !== 'ADMIN') {
      throw new ForbiddenException('Bạn không có quyền thực hiện chức năng này');
    }
    return this.apartmentsService.getAutoApproveSetting();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Lấy chi tiết căn hộ' })
  @ApiResponse({ status: 200, description: 'Trả về thông tin chi tiết căn hộ' })
  findById(@Param('id') id: string) {
    return this.apartmentsService.findById(id);
  }

  @Patch('system/auto-approve')
  @ApiOperation({ summary: 'Cập nhật cấu hình tự động duyệt căn hộ của hệ thống (Admin)' })
  updateAutoApproveSetting(
    @Body() body: { isAutoApprove: boolean },
    @CurrentUser('role') role: string,
  ) {
    if (role !== 'ADMIN') {
      throw new ForbiddenException('Bạn không có quyền thực hiện chức năng này');
    }
    return this.apartmentsService.updateAutoApproveSetting(body.isAutoApprove);
  }

  @Patch(':id/status')
  @ApiOperation({ summary: 'Duyệt / Ẩn căn hộ (Admin)' })
  @ApiResponse({ status: 200, description: 'Cập nhật trạng thái thành công' })
  toggleApartmentStatus(
    @Param('id') id: string,
    @Body() body: { isActive: boolean },
    @CurrentUser('role') role: string,
  ) {
    if (role !== 'ADMIN') {
      throw new ForbiddenException('Bạn không có quyền thực hiện chức năng này');
    }
    return this.apartmentsService.toggleApartmentStatus(id, body.isActive);
  }

  @Patch(':id/auto-approve')
  @ApiOperation({ summary: 'Bật / Tắt tự động duyệt booking' })
  @ApiResponse({ status: 200, description: 'Cập nhật trạng thái tự động duyệt thành công' })
  toggleAutoApproveStatus(
    @Param('id') id: string,
    @Body() body: { isAutoApprove: boolean },
    @CurrentUser('userId') userId: string,
  ) {
    return this.apartmentsService.toggleAutoApproveStatus(id, body.isAutoApprove, userId);
  }

  @Post(':id/reviews')
  @ApiOperation({ summary: 'Đánh giá căn hộ (Tenant)' })
  @ApiResponse({ status: 201, description: 'Đánh giá đã được tạo thành công' })
  createReview(
    @Param('id') id: string,
    @Body() dto: CreateReviewDto,
    @CurrentUser('userId') userId: string,
  ) {
    return this.apartmentsService.createReview(id, dto, userId);
  }

  @Get(':id/reviews')
  @ApiOperation({ summary: 'Lấy danh sách đánh giá của căn hộ' })
  @ApiResponse({ status: 200, description: 'Trả về mảng các đánh giá' })
  findReviewsByApartment(@Param('id') id: string) {
    return this.apartmentsService.findReviewsByApartment(id);
  }
}

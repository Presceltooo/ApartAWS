import { Controller, Get, Post, Body, Param, Put, Delete, Query, HttpStatus, HttpCode } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery, ApiSecurity } from '@nestjs/swagger';
import { ApartmentsService } from './apartment.service';
import { CreateApartmentDto, UpdateApartmentDto } from './dto';
import { CurrentUser } from '../../common/decorators/user.decorator';

@ApiTags('Apartments')
@ApiSecurity('x-user-id')
@ApiSecurity('x-user-role')
@Controller('Apartments')
export class ApartmentsController {
  constructor(private readonly apartmentsService: ApartmentsService) {}

  @Get()
  @ApiOperation({ summary: 'Lấy danh sách tất cả căn hộ' })
  @ApiResponse({ status: 200, description: 'Trả về mảng các căn hộ thực tế' })
  @ApiQuery({ name: 'Keyword', required: false, type: String })
  @ApiQuery({ name: 'Page', required: false, type: String })
  @ApiQuery({ name: 'PageSize', required: false, type: String })
  findAll(@Query('Keyword') Keyword?: string, @Query('Page') Page?: string, @Query('PageSize') PageSize?: string) {
    return this.apartmentsService.findAll(Keyword, Page ? +Page : 1, PageSize ? +PageSize : 10);
  }

  @Get('listing')
  @ApiOperation({ summary: 'Lấy danh sách căn hộ active (public)' })
  @ApiResponse({ status: 200, description: 'Trả về danh sách căn hộ active' })
  @ApiQuery({ name: 'Keyword', required: false, type: String })
  @ApiQuery({ name: 'Page', required: false, type: String })
  @ApiQuery({ name: 'PageSize', required: false, type: String })
  findListing(@Query('Keyword') keyword?: string, @Query('Page') page?: string, @Query('PageSize') pageSize?: string) {
    return this.apartmentsService.findListing(keyword, page ? +page : 1, pageSize ? +pageSize : 10);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Lấy chi tiết căn hộ' })
  @ApiResponse({ status: 200, description: 'Trả về thông tin chi tiết căn hộ' })
  findById(@Param('id') id: string) {
    return this.apartmentsService.findById(id);
  }

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
}

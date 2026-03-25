import { Controller, Get, Post, Body, Param, Put, Delete, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery } from '@nestjs/swagger';
import { ApartmentsService } from './apartment.service';
import { CreateApartmentDto, UpdateApartmentDto } from './dto';

@ApiTags('apartments')
@Controller('apartments')
export class ApartmentsController {
  constructor(private readonly apartmentsService: ApartmentsService) {}

  
  @Get()
  @ApiOperation({ summary: 'Lấy danh sách tất cả căn hộ từ CSDL' })
  @ApiResponse({ status: 200, description: 'Trả về mảng các căn hộ thực tế' })
  @ApiQuery({ name: 'Keyword', required: false, type: String })
  @ApiQuery({ name: 'Page', required: false, type: String })
  @ApiQuery({ name: 'PageSize', required: false, type: String })
  findAll(@Query('Keyword') Keyword?: string, @Query('Page') Page?: string, @Query('PageSize') PageSize?: string) {
    return this.apartmentsService.findAll(Keyword, Page ? +Page : 1, PageSize ? +PageSize : 10);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Lấy chi tiết căn hộ từ CSDL' })
  @ApiResponse({ status: 200, description: 'Trả về thông tin chi tiết căn hộ' })
  findById(@Param('id') id: string) {
    return this.apartmentsService.findById(id);
  }

  @Post()
  @ApiOperation({ summary: 'Lưu căn hộ mới vào CSDL' })
  @ApiResponse({ status: 201, description: 'Căn hộ đã được tạo và lưu' })
  create(@Body() createApartmentDto: CreateApartmentDto) {
    return this.apartmentsService.create(createApartmentDto);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Cập nhật thông tin căn hộ' })
  @ApiResponse({ status: 200, description: 'Căn hộ đã được cập nhật' })
  update(@Param('id') id: string, @Body() updateApartmentDto: UpdateApartmentDto) {
    return this.apartmentsService.update(id, updateApartmentDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Xoá căn hộ' })
  @ApiResponse({ status: 200, description: 'Căn hộ đã được xoá' })
  remove(@Param('id') id: string) {
    return this.apartmentsService.remove(id);
  }

  @Get('listing')
  @ApiOperation({ summary: 'Lấy danh sách căn hộ active' })
  @ApiResponse({ status: 200, description: 'Trả về danh sách căn hộ active' })
  @ApiQuery({ name: 'Keyword', required: false, type: String })
  @ApiQuery({ name: 'Page', required: false, type: String })
  @ApiQuery({ name: 'PageSize', required: false, type: String })
  findListing(@Query('Keyword') keyword?: string, @Query('Page') page?: string, @Query('PageSize') pageSize?: string) {
    return this.apartmentsService.findListing(keyword, page ? +page : 1, pageSize ? +pageSize : 10);
  }
}

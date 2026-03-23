import { Controller, Get, Post, Body, Param, Put, Delete } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { ApartmentsService } from './apartment.service';
import { CreateApartmentDto } from './dto/create-apartment.dto';

@ApiTags('apartments')
@Controller('apartments')
export class ApartmentsController {
  constructor(private readonly apartmentsService: ApartmentsService) {}

  @Get()
  @ApiOperation({ summary: 'Lấy danh sách tất cả căn hộ từ CSDL' })
  @ApiResponse({ status: 200, description: 'Trả về mảng các căn hộ thực tế' })
  findAll() {
    return this.apartmentsService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Lấy danh sách tất cả căn hộ từ CSDL' })
  @ApiResponse({ status: 200, description: 'Trả về mảng các căn hộ thực tế' })
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
  @ApiOperation({ summary: 'Lưu căn hộ mới vào CSDL' })
  @ApiResponse({ status: 201, description: 'Căn hộ đã được tạo và lưu' })
  update(@Body() createApartmentDto: CreateApartmentDto) {
    return this.apartmentsService.create(createApartmentDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Lưu căn hộ mới vào CSDL' })
  @ApiResponse({ status: 201, description: 'Căn hộ đã được tạo và lưu' })
  delete(@Body() createApartmentDto: CreateApartmentDto) {
    return this.apartmentsService.create(createApartmentDto);
  }

  @Get()
  @ApiOperation({ summary: 'Lấy danh sách tất cả căn hộ từ CSDL' })
  @ApiResponse({ status: 200, description: 'Trả về mảng các căn hộ thực tế' })
  findListing() {
    return this.apartmentsService.findListing();
  }
}

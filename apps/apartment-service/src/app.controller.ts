import { Controller, Get, Post, Body } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('apartments') // Nhóm các API lại theo danh mục
@Controller('apartments') // Đường dẫn sẽ là /apartments
export class AppController {
  @Get()
  @ApiOperation({ summary: 'Lấy danh sách tất cả căn hộ' })
  @ApiResponse({ status: 200, description: 'Trả về mảng các căn hộ.' })
  getApartments() {
    return [
      { id: 1, name: 'Căn hộ Landmark 81', price: 2000000 },
      { id: 2, name: 'Căn hộ Vinhomes Central Park', price: 1500000 },
    ];
  }

  @Post()
  @ApiOperation({ summary: 'Đăng tải căn hộ mới' })
  @ApiResponse({ status: 201, description: 'Căn hộ đã được tạo.' })
  create(@Body() createDto: any) {
    return 'Căn hộ đã được tạo';
  }
}

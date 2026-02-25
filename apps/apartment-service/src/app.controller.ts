// import { Controller, Get } from '@nestjs/common';
// import { AppService } from './app.service';

// @Controller()
// export class AppController {
//   constructor(private readonly appService: AppService) {}

//   @Get()
//   getHello(): string {
//     return this.appService.getHello();
//   }
// }
// Test SSH

import { Controller, Get } from '@nestjs/common';

@Controller('apartments') // Đường dẫn sẽ là /apartments
export class AppController {
  @Get()
  getApartments() {
    return [
      { id: 1, name: 'Căn hộ Landmark 81', price: 2000000 },
      { id: 2, name: 'Căn hộ Vinhomes Central Park', price: 1500000 },
    ];
  }
}

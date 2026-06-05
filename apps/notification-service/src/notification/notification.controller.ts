import {
  Controller,
  Get,
  Put,
  Delete,
  Param,
  Query,
  Body,
  ParseIntPipe,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { NotificationService } from './notification.service';
import { CurrentUser, GatewayUser } from '../common/decorators/user.decorator';

@Controller('notifications')
export class NotificationController {
  constructor(private readonly notificationService: NotificationService) {}

  @Get('my-notifications')
  @HttpCode(HttpStatus.OK)
  async getMyNotifications(
    @CurrentUser() user: GatewayUser,
    @Query('page') page = '1',
    @Query('pageSize') pageSize = '20',
    @Query('daXem') daXem?: string,
  ) {
    const isDaXem = daXem === 'true' ? true : daXem === 'false' ? false : undefined;
    return this.notificationService.getNotifications(user.userId, {
      page: +page || 1,
      pageSize: +pageSize || 20,
      daXem: isDaXem,
    });
  }

  @Get('unread-count')
  @HttpCode(HttpStatus.OK)
  async getUnreadCount(@CurrentUser() user: GatewayUser) {
    const count = await this.notificationService.countUnread(user.userId);
    return { data: count };
  }

  @Put(':id/read')
  @HttpCode(HttpStatus.OK)
  async markAsRead(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser() user: GatewayUser,
  ) {
    return this.notificationService.markAsRead(id, user.userId);
  }

  @Put('read-all')
  @HttpCode(HttpStatus.OK)
  async markAllAsRead(@CurrentUser() user: GatewayUser) {
    return this.notificationService.markAllAsRead(user.userId);
  }

  @Delete('delete-many')
  @HttpCode(HttpStatus.OK)
  async deleteNotifications(
    @Body('ids') ids: number[],
    @CurrentUser() user: GatewayUser,
  ) {
    return this.notificationService.deleteMany(ids, user.userId);
  }
}

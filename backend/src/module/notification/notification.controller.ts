import { Controller, Delete, Get, HttpCode, Param, Put } from '@nestjs/common';
import { Auth } from 'src/module/auth/decorators/auth.decorator';
import { CurrentUser } from 'src/module/auth/decorators/user.decorator';
import { NotificationService } from './notification.service';

@Controller('notifications')
export class NotificationController {
  constructor(private readonly notificationService: NotificationService) {}

  // @HttpCode(200)
  // @Auth()
  // @Get('my')
  // async getMyNotifications(
  //   @CurrentUser('id') userId: string,
  //   @Query('skip') skip?: number,
  //   @Query('take') take?: number,
  //   @Query('isRead') isRead?: string,
  // ) {
  //   return this.notificationService.getByUserId(userId, {
  //     skip,
  //     take,
  //     isRead: isRead ? isRead === 'true' : undefined,
  //   });
  // }

  @HttpCode(200)
  @Auth()
  @Get('my/unread-count')
  async getUnreadCount(@CurrentUser('id') userId: string) {
    return {
      count: await this.notificationService.getUnreadCount(userId),
    };
  }

  @HttpCode(200)
  @Auth()
  @Get(':id')
  async getById(@Param('id') id: string) {
    return this.notificationService.getById(id);
  }

  // @UsePipes(new ValidationPipe())
  // @HttpCode(200)
  // @Auth()
  // @Put(':id/read')
  // async markAsRead(@Param('id') id: string) {
  //   return this.notificationService.markAsRead(id);
  // }

  @HttpCode(200)
  @Auth()
  @Put('my/read-all')
  async markAllAsRead(@CurrentUser('id') userId: string) {
    return this.notificationService.markAllAsRead(userId);
  }

  @HttpCode(200)
  @Auth()
  @Delete(':id')
  async delete(@Param('id') id: string) {
    return this.notificationService.delete(id);
  }

  @Get()
  @Auth()
  async getMyNotifications(@CurrentUser('id') userId: string) {
    return this.notificationService.getUserNotifications(userId);
  }

  @Put(':id/read')
  @Auth()
  async markAsRead(@Param('id') id: string) {
    return this.notificationService.markAsRead(id);
  }
}

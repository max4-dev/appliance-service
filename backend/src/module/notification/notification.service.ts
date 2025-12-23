import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/common/database/prisma.service';
import { CreateNotificationDto } from './dto/notification.dto';

@Injectable()
export class NotificationService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateNotificationDto) {
    return this.prisma.notification.create({
      data: {
        userId: dto.userId,
        requestId: dto.requestId,
        type: dto.type,
        title: dto.title,
        message: dto.message,
      },
    });
  }

  async getByUserId(
    userId: string,
    params: {
      skip?: number;
      take?: number;
      isRead?: boolean;
    },
  ) {
    return this.prisma.notification.findMany({
      where: {
        userId,
        ...(params.isRead !== undefined && { isRead: params.isRead }),
      },
      include: {
        request: {
          select: {
            id: true,
            requestStatus: true,
            climateTechModel: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
      skip: params.skip,
      take: params.take,
    });
  }

  async getById(id: string) {
    const notification = await this.prisma.notification.findUnique({
      where: { id },
      include: {
        request: true,
      },
    });

    if (!notification) {
      throw new HttpException('Уведомление не найдено', HttpStatus.NOT_FOUND);
    }

    return notification;
  }

  async markAsRead(id: string) {
    return this.prisma.notification.update({
      where: { id },
      data: {
        isRead: true,
        readAt: new Date(),
      },
    });
  }

  async markAllAsRead(userId: string) {
    return this.prisma.notification.updateMany({
      where: {
        userId,
        isRead: false,
      },
      data: {
        isRead: true,
        readAt: new Date(),
      },
    });
  }

  async delete(id: string) {
    return this.prisma.notification.delete({
      where: { id },
    });
  }

  async getUnreadCount(userId: string) {
    return this.prisma.notification.count({
      where: {
        userId,
        isRead: false,
      },
    });
  }

  async deleteOldNotifications(daysOld: number = 30) {
    const date = new Date();
    date.setDate(date.getDate() - daysOld);

    return this.prisma.notification.deleteMany({
      where: {
        AND: [{ createdAt: { lt: date } }, { isRead: true }],
      },
    });
  }

  async getUserNotifications(userId: string) {
    return this.prisma.notification.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
  }
}

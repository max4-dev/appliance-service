import { NotificationType } from '@prisma/client';
import { IsInt, IsOptional, IsString } from 'class-validator';

export enum NotificationTypeEnum {
  STATUS_CHANGED = 'STATUS_CHANGED',
  ASSIGNED_TO_YOU = 'ASSIGNED_TO_YOU',
  COMMENT_ADDED = 'COMMENT_ADDED',
  PARTS_ORDERED = 'PARTS_ORDERED',
  COMPLETION = 'COMPLETION',
}

export class CreateNotificationDto {
  @IsString()
  userId: string;

  @IsInt()
  @IsOptional()
  requestId?: number;

  @IsString()
  type: NotificationType;

  @IsString()
  title: string;

  @IsString()
  message: string;
}

export class MarkAsReadDto {}

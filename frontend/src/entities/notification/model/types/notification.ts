export enum NotificationType {
  STATUS_CHANGED = 'STATUS_CHANGED',
  ASSIGNED_TO_YOU = 'ASSIGNED_TO_YOU',
  COMMENT_ADDED = 'COMMENT_ADDED',
  PARTS_ORDERED = 'PARTS_ORDERED',
  COMPLETION = 'COMPLETION'
}

export interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  isRead: boolean;
  createdAt: string;
  requestId?: number;
}

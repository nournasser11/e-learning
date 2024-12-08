import { IsNotEmpty, IsString, IsEnum, IsBoolean } from 'class-validator';

export enum NotificationType {
  MESSAGE = 'message',
  REPLY = 'reply',
  ANNOUNCEMENT = 'announcement',
}

export class CreateNotificationDto {
  @IsNotEmpty()
  @IsString()
  recipientId: string; // User ID of recipient (student/instructor)

  @IsNotEmpty()
  @IsEnum(NotificationType)
  type: NotificationType; // Type of notification

  @IsNotEmpty()
  @IsString()
  content: string; // Content of the notification

  @IsBoolean()
  isRead: boolean; // Whether the notification is read (default: false)
}

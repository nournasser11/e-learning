import { IsBoolean } from 'class-validator';

export class UpdateNotificationDto {
  @IsBoolean()
  isRead: boolean; // To update the read/unread status of a notification
}

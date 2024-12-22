import { IsNotEmpty, IsString, IsEnum, IsBoolean } from 'class-validator';

export class CreateNotificationDto {
  recipientId?: string; // Optional for announcements
  senderId: string; // Required for all types
  type: 'message' | 'reply' | 'announcement'; // Restrict to allowed types
  content: string; // Notification content
  courseId?: string; // Required for announcements
}


import { Controller, Get, Post, Body, Param, Patch } from '@nestjs/common';
import { NotificationService } from './NotificationService';
import { CreateNotificationDto } from './DTO/CreateNotificationDTO';
import { Notification } from './NotificationSchema';

@Controller('notifications')
export class NotificationController {
  constructor(private readonly notificationService: NotificationService) { }

  // Create a new notification
  @Post()
  async create(@Body() createNotificationDto: CreateNotificationDto): Promise<Notification | Notification[]> {
    return this.notificationService.create(createNotificationDto);
  }

  // Get notifications for a user
  @Get(':userId')
  async findByUserId(@Param('userId') userId: string): Promise<Notification[]> {
    return this.notificationService.findByUserId(userId);
  }

  // Mark a notification as read
  @Patch(':notificationId')
  async markAsRead(@Param('notificationId') notificationId: string): Promise<Notification> {
    return this.notificationService.markAsRead(notificationId);
  }
}

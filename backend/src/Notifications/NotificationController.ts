import { Controller, Get, Post, Body, Param, Patch } from '@nestjs/common';
import { NotificationService } from './notification.service';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { UpdateNotificationDto } from './dto/update-notification.dto';
import { Notification } from '../models/notification.schema';

@Controller('notifications')
export class NotificationController {
  constructor(private readonly notificationService: NotificationService) {}

  // Create a new notification
  @Post()
  create(@Body() createNotificationDto: CreateNotificationDto): Promise<Notification> {
    return this.notificationService.create(createNotificationDto);
  }

  // Get notifications for a user by userId
  @Get(':userId')
  findByUserId(@Param('userId') userId: string): Promise<Notification[]> {
    return this.notificationService.findByUserId(userId);
  }

  // Mark a notification as read
  @Patch(':notificationId')
  markAsRead(@Param('notificationId') notificationId: string): Promise<Notification> {
    return this.notificationService.markAsRead(notificationId);
  }
}

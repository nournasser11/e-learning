import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Notification } from './NotificationSchema';
import { CreateNotificationDto } from './DTO/CreateNotificationDTO';
import { UpdateNotificationDto } from './DTO/UpdateNotificationDto';

@Injectable()
export class NotificationService {
  constructor(
    @InjectModel(Notification.name) private notificationModel: Model<Notification>,
  ) {}

  // Create a new notification
  async create(createNotificationDto: CreateNotificationDto): Promise<Notification> {
    const notification = new this.notificationModel(createNotificationDto);
    return notification.save();
  }

  // Get notifications for a specific user (student/instructor)
  async findByUserId(userId: string): Promise<Notification[]> {
    return this.notificationModel.find({ recipientId: userId }).exec();
  }

  // Mark a notification as read
  async markAsRead(notificationId: string): Promise<Notification> {
    return this.notificationModel.findByIdAndUpdate(
      notificationId,
      { isRead: true },
      { new: true },
    ).exec();
  }

  // Optionally, real-time notifications can be triggered here (if needed via WebSocket or other methods)
  async sendRealTimeNotification(notification: Notification) {
    // Trigger real-time notification (via WebSocket or push notification)
    // Example: this.webSocketGateway.sendNotification(notification);
  }
}

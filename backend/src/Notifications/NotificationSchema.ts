import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type NotificationDocument = Notification & Document;

@Schema()
export class Notification {
  @Prop({ required: true })
  recipientId: string; // The ID of the user receiving the notification

  @Prop({ required: true })
  senderId: string; // The ID of the user sending the notification

  @Prop({ required: true })
  type: string; // Notification type: 'message', 'reply', or 'announcement'

  @Prop({ required: true })
  content: string; // Notification content

  @Prop({ required: false })
  courseId?: string; // Optional for course-related notifications

  @Prop({ default: false })
  isRead: boolean; // Whether the notification is read

  @Prop({ default: Date.now })
  createdAt: Date; // Timestamp
}

export const NotificationSchema = SchemaFactory.createForClass(Notification);

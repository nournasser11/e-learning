import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class Notification extends Document {
  @Prop({ required: true })
  recipientId: string; // User ID of the recipient (student/instructor)

  @Prop({ required: true })
  type: string; // 'message', 'reply', or 'announcement'

  @Prop({ required: true })
  content: string; // Content of the notification

  @Prop({ default: false })
  isRead: boolean; // Whether the notification is read

  @Prop({ default: Date.now })
  createdAt: Date; // Timestamp
}

export const NotificationSchema = SchemaFactory.createForClass(Notification);

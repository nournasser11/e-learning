import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type MessageDocument = Message & Document;

@Schema()
export class Message {
  @Prop({ required: true })
  chatRoomId: string; // Unique identifier for the chat room

  @Prop({ required: true })
  senderId: string;

  @Prop({ required: true })
  receiverId: string;

  @Prop({ required: true })
  message: string;

  @Prop({ default: Date.now })
  createdAt: Date;
}

export const MessageSchema = SchemaFactory.createForClass(Message);
@Schema()
export class ChatRoom {
  @Prop({ required: true, unique: true })
  participants: string[]; // Array of user IDs (e.g., ["user123", "user456"])
}

export const ChatRoomSchema = SchemaFactory.createForClass(ChatRoom);
export type ChatRoomDocument = ChatRoom & Document;

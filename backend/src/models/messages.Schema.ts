import {Prop, Schema, SchemaFactory} from '@nestjs/mongoose';
import {Document} from 'mongoose';

export type MessageDocument = Message & Document;

@Schema()
export class Message {
  
  @Prop({required: true})
  userId: string;

  @Prop({required: true})
  message: string;

  @Prop({required: true})
  createdAt: Date;
}
export const MessageSchema = SchemaFactory.createForClass(Message);


import {Prop, Schema, SchemaFactory} from '@nestjs/mongoose';
import {Document} from 'mongoose';

@Schema()
export class Message {
  @Prop({required: true})
  messageId: string;

  @Prop({required: true})
  userId: string;

  @Prop({required: true})
  message: string;

  @Prop({required: true})
  createdAt: Date;
}


import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type ResponseDocument = Response & Document;

@Schema({ timestamps: true })
export class Response {
  @Prop({ required: true })
  responseId: string;

  @Prop({ required: true })
  userId: string;

  @Prop({ required: true })
  quizId: string;

  @Prop({ required: true, type: [Object] })
  answers: Record<string, any>[];

  @Prop({ required: true })
  score: number;

  @Prop({ default: Date.now })
  submittedAt: Date;
}

export const ResponseSchema = SchemaFactory.createForClass(Response);
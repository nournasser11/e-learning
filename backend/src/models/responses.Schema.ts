
import { model, Document } from 'mongoose';
import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
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

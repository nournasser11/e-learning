import { model, Document } from 'mongoose';
import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
@Schema({ timestamps: true })
export class Quiz {
  @Prop({ required: true })
  quizId: string;

  @Prop({ required: true })
  moduleId: string;

  @Prop({ required: true, type: [Object] })
  questions: Record<string, any>[];

  @Prop({ default: Date.now })
  createdAt: Date;
}

export const QuizSchema = SchemaFactory.createForClass(Quiz);

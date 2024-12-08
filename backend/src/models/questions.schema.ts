import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class Question {
  @Prop({ required: true })
  questionId: string;

  
  @Prop({ required: true })
  difficulty: Difficulty;

  @Prop({ required: true })
  type: string;

  @Prop({ required: true })
  text: string;

  @Prop({ required: true, type: [Object] })
  options: { text: string; isCorrect: boolean }[];
}
export enum Difficulty {
  Easy = 'easy',
  Medium = 'medium',
  Hard = 'hard',
}

export type QuestionDocument = Question & Document;

export const QuestionSchema = SchemaFactory.createForClass(Question);

import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class Quiz {
  @Prop({ required: true })
  questionId: string;

  @Prop({ required: true })
  difficulty: string;

  @Prop({ required: true })
  type: string;

  @Prop({ required: true })
  text: string;

  @Prop()
  correctAnswers: number;


  @Prop({ required: true, type: [Object] })
  options: { text: string; isCorrect: boolean }[];
}

export type QuizDocument = Quiz & Document;

// Create the Mongoose schema for the Quiz class
export const QuizSchema = SchemaFactory.createForClass(Quiz);
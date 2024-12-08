import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type ProgressDocument = Progress & Document;

@Schema({ timestamps: true })
export class Progress {
  @Prop({ required: true })
  progressId: string;
  

  @Prop({ required: true })
  userId: string;

  @Prop({ required: true })
  courseId: string;

  @Prop({ required: true })
  completionPercentage: number;

  @Prop({ default: Date.now })
  lastAccessed: Date;
  @Prop({ default: false })
  completed: boolean;
  @Prop({ required: true })
  quizId: string; 

}

export const ProgressSchema = SchemaFactory.createForClass(Progress);
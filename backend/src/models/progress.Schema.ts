import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type ProgressDocument = Progress & Document;

@Schema({ timestamps: true })
export class Progress {
  @Prop({ unique: true })
  progressId: string;


  @Prop({ required: true })
  userId: string;

  @Prop({ required: true })
  courseId: string;

  @Prop({ required: true, min: 0, max: 100 })
  completionPercentage: number;

  @Prop({ default: Date.now, required: true })
  lastAccessed: Date;
  @Prop({ default: false })
  completed: boolean;
  @Prop({ required: true })
  quizId: string; 

}


export const ProgressSchema = SchemaFactory.createForClass(Progress);
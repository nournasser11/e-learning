
import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
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
}

export const ProgressSchema = SchemaFactory.createForClass(Progress);

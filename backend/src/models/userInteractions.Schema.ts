import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type UserInteractionDocument = UserInteraction & Document;

@Schema({ timestamps: true })
export class UserInteraction {
  @Prop({ required: true })
  interactionId: string;

  @Prop({ required: true })
  userId: string;

  @Prop({ required: true })
  courseId: string;

  @Prop({ required: true, type: Number })
  score: number;

  @Prop({ required: true, type: Number })
  timeSpentMinutes: number;

  @Prop({ required: true })
  lastAccessed: Date;
}

export const UserInteractionSchema = SchemaFactory.createForClass(UserInteraction);

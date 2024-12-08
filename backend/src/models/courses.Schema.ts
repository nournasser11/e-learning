import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type CourseDocument = Course & Document;

@Schema({ timestamps: true })
export class Course {
  @Prop({ required: true })
  courseId: string;

  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  description: string;

  @Prop({ required: true })
  category: string;

  @Prop({ required: true, enum: ['easy', 'medium', 'hard'] })
  difficultyLevel: string;

  @Prop({ required: true })
  createdBy: string;

  @Prop({ default: Date.now })
  createdAt: Date;

  @Prop({ default: 0 })
  enrolledStudents: number;

  @Prop({ default: 0 })
  completedStudents: number;

  @Prop({ type: [String], default: [] })
  assignedUsers: string[];

  @Prop({ type: [Number], default: [] })
  ratings: number[];

  // New version field
  @Prop({ type: Number, default: 1 })
  version: number;

  // Previous versions (optional)
  @Prop({ type: Array, default: [] })
  previousVersions: { title: string; description: string; updatedAt: Date }[];
  @Prop()

  updatedAt?: Date;
  @Prop({ type: [String], default: [] })
  resources: string[];

}


export const CourseSchema = SchemaFactory.createForClass(Course);

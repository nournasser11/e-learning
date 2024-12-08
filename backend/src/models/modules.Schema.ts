import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type ModuleDocument = Module & Document;

@Schema({ timestamps: true })
export class Module {
  @Prop({ required: true, unique: true })
  moduleId: string;

  @Prop({ required: true })
  courseId: string;

  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  content: string;

  @Prop({ type: [String], default: [] })
  resources?: string[];

  @Prop({ default: () => new Date() })
  createdAt?: Date;

  @Prop()
  updatedAt?: Date;
  @Prop({ type: [{ type: String, ref: 'Course' }] })
  courses: string[];
  @Prop({ type: Number, default: 1 })
  version: number;

  // Optional: store previous versions
  @Prop({ type: Array, default: [] })
  previousVersions: { title: string; content: string; updatedAt: Date }[];
}


export const ModuleSchema = SchemaFactory.createForClass(Module);

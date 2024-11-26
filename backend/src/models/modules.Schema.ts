
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type modulesDocument = Module & Document;
@Schema({ timestamps: true })
export class Module {
  @Prop({ required: true })
  moduleId: string;

  @Prop({ required: true })
  courseId: string;

  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  content: string;

  @Prop([String])
  resources?: string[];

  @Prop({ default: Date.now })
  createdAt: Date;
}

export const ModuleSchema = SchemaFactory.createForClass(Module);

import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import * as mongoose from 'mongoose';

@Schema({ timestamps: true })
export class Note extends Document{
  @Prop({ type: String, default: () => new mongoose.Types.ObjectId() }) // Automatically generated ID
  noteId: string;

  @Prop({ required: true })
  userId: string;

  @Prop({ required: false })
  courseId?: string;
  
  @Prop({ required: true })
  title: string;
  
  @Prop({ required: true })
  content: string;

}

export const NotesSchema = SchemaFactory.createForClass(Note);
export type NoteDocument= Note & Document;
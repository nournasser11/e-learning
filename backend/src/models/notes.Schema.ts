import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class Note extends Document{
  @Prop({ required: true })
  content: string;
  
  @Prop({ required: true })
  moduleId: string;

  @Prop({ required: true })
  userId: string;

}

export const NotesSchema = SchemaFactory.createForClass(Note);
export type NoteDocument= Note & Document; 
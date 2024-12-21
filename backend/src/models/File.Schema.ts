import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class FileMetadata {
  @Prop({ required: true })
  filename: string;

  @Prop({ required: true })
  fileUrl: string;
}

export type FileMetadataDocument = FileMetadata & Document;

export const FileMetadataSchema = SchemaFactory.createForClass(FileMetadata);

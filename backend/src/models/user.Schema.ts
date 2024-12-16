import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import * as mongoose from 'mongoose';

export type UserDocument = User & Document;

@Schema({ timestamps: true })
export class User extends Document {
  @Prop({ required: true, minlength: 3 })
  name: string;

  @Prop({ type: String, default: () => new mongoose.Types.ObjectId() }) // Automatically generated ID
  userId: string;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true })
  passwordHash: string;

  @Prop({ required: true, enum: ['student', 'instructor', 'admin'] })
  role: string;

  @Prop()
  profilePictureUrl?: string;

  @Prop({ default: () => new Date() })
  createdAt: Date;

  @Prop({
    type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Course' }], // Reference to Course
    default: [],
  })
  enrolledCourses: mongoose.Types.ObjectId[];
}

export const UserSchema = SchemaFactory.createForClass(User);

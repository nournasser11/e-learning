import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';
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

  @Prop({ default: '' }) // Default to an empty string for profile pictures
  profilePicture: string;

  @Prop({ default: () => new Date() })
  createdAt: Date;
  @Prop({ type: [MongooseSchema.Types.ObjectId], ref: 'Course', default: [] })
  enrolledCourses: MongooseSchema.Types.ObjectId[]; // Array of ObjectIds referencing Course

}

export const UserSchema = SchemaFactory.createForClass(User);

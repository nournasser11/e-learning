import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, model } from 'mongoose';
import { Types } from 'mongoose';

export type UserDocument = User & Document;

// Define roles using an enum for type safety
export enum UserRole {
  Student = 'student',
  Instructor = 'instructor',
  Admin = 'admin',
}

@Schema({ timestamps: true })
export class User extends Document {
  @Prop({ required: true, minlength: 3 })
  name: string;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true })
  passwordHash: string;

  @Prop({ required: true, enum: UserRole }) // Use enum for roles
  role: UserRole;

  @Prop()
  profilePictureUrl?: string;

  @Prop({ type: [String], default: [] })
  courses: string[];

  @Prop({
    type: [{ type: Types.ObjectId, ref: 'Course' }],
    default: [],
  })
  enrolledCourses?: Types.ObjectId[];

  // Instance method to check if the user is a student
  isStudent(): boolean {
    return this.role === UserRole.Student;
  }
}

export const UserSchema = SchemaFactory.createForClass(User);

// Optionally add schema-level methods or hooks
UserSchema.methods.isStudent = function (): boolean {
  return this.role === UserRole.Student;
};

// Export the model
export const UserModel = model<User>('User', UserSchema);

import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, model } from 'mongoose';
import * as mongoose from 'mongoose';
import { Types } from 'mongoose';
export type UserDocument = User & Document;

@Schema({ timestamps: true })
export class User extends Document {
  @Prop({ required: true, minlength: 3 })
name: string;
 
  @Prop({  unique: true })
  userId: string;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true })
  passwordHash: string;

  @Prop({ required: true, enum: ['student', 'instructor', 'admin'] })
  role: string;
  // @Prop({ type: [String], default: [] })
  // courses: string[];

  @Prop()
  profilePictureUrl?: string;

  @Prop({ default: () => new Date() })
  createdAt: Date;
  @Prop({ type: [String], default: [] })
  courses: string[];

  isStudent(): boolean {
    return this.role === 'student';
  }
  @Prop({
    type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Course' }],
    default: [],
})
enrolledCourses?: Types.ObjectId[];
}


export const UserSchema = SchemaFactory.createForClass(User);
export const UserModel = model<User>('User', UserSchema);

// Pre-save hook to set `courseId` equal to `_id`
UserSchema.pre('save', function (next) {
  this.userId = this._id.toString();
  next();
});
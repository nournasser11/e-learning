import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, model } from 'mongoose';
import * as mongoose from 'mongoose';
import * as bcrypt from 'bcrypt';
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

  @Prop({ default: '' }) // Default to an empty string for profile pictures
  profilePicture: string;

  @Prop({ default: () => new Date() })
  createdAt: Date;

  @Prop({
    type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Course' }], // Reference to Course
    default: [],
  })
  enrolledCourses: mongoose.Types.ObjectId[];
}


export const UserSchema = SchemaFactory.createForClass(User);
export const UserModel = model<User>('User', UserSchema);

// Pre-save hook to set `courseId` equal to `_id`
UserSchema.pre('save', async function (next) {
  if (this.isModified('password') || this.isNew) {
    const salt = await bcrypt.genSalt(10);
    this.passwordHash = await bcrypt.hash(this.passwordHash, salt);
  }
  next();
});
// Pre-save hook to set courseId equal to _id
UserSchema.pre('save', function (next) {
  this.userId = this._id.toString();
  next();
});

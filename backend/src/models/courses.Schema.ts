import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema, Types } from 'mongoose';

export type CourseDocument = Course & Document;

enum CourseStatus {
  VALID = 'valid',
  INVALID = 'invalid',
  DELETED = 'deleted'
}

// Subdocument for Modules
class ModuleDetails {
  @Prop({ type: Types.ObjectId, ref: 'Module', required: true })
  moduleId!: Types.ObjectId;

  @Prop({ required: true })
  moduleName!: string;
}

@Schema({ timestamps: true })
export class Course {
  @Prop({ unique: true })
  courseId!: string;

  @Prop({ required: true })
  title!: string;

  @Prop({ required: true })
  description!: string;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: "User", required: true })
  instructor!: MongooseSchema.Types.ObjectId;

  @Prop({ default: 1 })
  version!: number;

  @Prop({ type: String, enum: Object.values(CourseStatus), default: CourseStatus.VALID })
  status!: CourseStatus;

  @Prop({ type: [{ type: Types.ObjectId, ref: 'User' }], default: [] })
  assignedStudents: Types.ObjectId[];

  @Prop({ type: [{ type: Types.ObjectId, ref: 'User' }], default: [] })
  completedStudents: Types.ObjectId[];

  // Modules with name and ID
  @Prop({ type: [{ type: Types.ObjectId, ref: 'Module' }], default: [] })
  modules: Types.ObjectId[]; // Array of Module IDs only

}

export const CourseSchema = SchemaFactory.createForClass(Course);

export { CourseStatus };

// Pre-save hook to set courseId equal to _id
CourseSchema.pre('save', function (next) {
  this.courseId = this._id.toString();
  next();
});
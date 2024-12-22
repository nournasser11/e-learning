import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { User, UserDocument } from '../models/user.schema';
import { Course, CourseDocument } from '../models/courses.schema';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';

export type EnrollmentDocument = Enrollment & Document;

@Schema({ timestamps: true })
export class Enrollment {
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User', required: true })
  userId: string;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Course', required: true })
  courseId: string;

  @Prop({ default: Date.now })
  enrolledAt: Date;
}

export const EnrollmentSchema = SchemaFactory.createForClass(Enrollment);



@Injectable()
export class EnrollmentService {
  constructor(
    @InjectModel(Enrollment.name) private readonly enrollmentModel: Model<EnrollmentDocument>,
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
    @InjectModel(Course.name) private readonly courseModel: Model<CourseDocument>,
  ) {}

  // Enroll user in a course
  async enroll(userId: string, courseId: string): Promise<Enrollment> {
    const user = await this.userModel.findById(userId);
    const course = await this.courseModel.findById(courseId);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    if (!course) {
      throw new NotFoundException('Course not found');
    }

    const existingEnrollment = await this.enrollmentModel.findOne({ userId, courseId });
    if (existingEnrollment) {
      throw new ConflictException('User is already enrolled in this course');
    }

    const newEnrollment = new this.enrollmentModel({ userId, courseId });
    return await newEnrollment.save();
  }

  async getEnrolledCourses(userId: string): Promise<Course[]> {
    const user = await this.userModel.findById(userId).populate('enrolledCourses');
    if (!user) {
      throw new NotFoundException('User not found');
    }
    const courses = await this.courseModel.find({ _id: { $in: user.enrolledCourses } });
    return courses; // Return the courses
  }


  // Get all users enrolled in a specific course
  async getEnrollmentsByCourse(courseId: string): Promise<Enrollment[]> {
    const courseObjectId = new Types.ObjectId(courseId);
    return this.enrollmentModel
      .find({ courseId: courseObjectId })
      .populate('userId')
      .exec();
  }

  // Find a user by their ID
  async findUserById(userId: string): Promise<User | null> {
    const userObjectId = new Types.ObjectId(userId);
    const user = await this.userModel.findById(userObjectId).exec();
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }
}

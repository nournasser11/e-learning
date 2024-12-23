import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Enrollment, EnrollmentDocument } from './enroll.schema';
import { User, UserDocument } from '../models/user.schema';
import { Course, CourseDocument } from '../models/courses.schema';

@Injectable()
export class EnrollmentService {
  constructor(
    @InjectModel(Enrollment.name) private readonly enrollmentModel: Model<EnrollmentDocument>,
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
    @InjectModel(Course.name) private readonly courseModel: Model<CourseDocument>,
  ) {}

  async enroll(userId: string, courseId: string): Promise<Enrollment> {
    try {
      console.log("Enroll function called with:", { userId, courseId }); // Debugging log
  
      // Convert userId and courseId to ObjectId
      const userObjectId = new Types.ObjectId(userId);
      const courseObjectId = new Types.ObjectId(courseId);
  
      // Step 1: Validate User and Course
      const user = await this.userModel.findById(userObjectId);
      if (!user) {
        throw new NotFoundException("User not found");
      }
  
      const course = await this.courseModel.findById(courseObjectId);
      if (!course) {
        throw new NotFoundException("Course not found");
      }
  
      // Step 2: Check if User is Already Enrolled
      const existingEnrollment = await this.enrollmentModel.findOne({
        userId: userObjectId,
        courseId: courseObjectId,
      });
      if (existingEnrollment) {
        throw new ConflictException("User is already enrolled in this course");
      }
  
      // Step 3: Add the Course to User's Enrolled Courses
      if (!user.enrolledCourses.includes(courseObjectId)) {
        user.enrolledCourses.push(courseObjectId);
        await user.save(); // Save updated user document
      }
  
      // Step 4: Add the User to Course's Enrolled Users
      if (!course.enrolledUsers.includes(userObjectId.toString())) {
        course.enrolledUsers.push(userObjectId.toString());
        await course.save(); // Save updated course document
      }
  
      // Step 5: Create and Save Enrollment Record
      const newEnrollment = new this.enrollmentModel({
        userId: userObjectId,
        courseId: courseObjectId,
      });
      const savedEnrollment = await newEnrollment.save();
  
      console.log("Enrollment saved successfully:", savedEnrollment);
      return savedEnrollment;
    } catch (error) {
      console.error("Error during enrollment:", error);
      throw error;
    }
  }
  
  async getEnrollmentsByUser(userId: string): Promise<Enrollment[]> {
    const userObjectId = new Types.ObjectId(userId);
    return this.enrollmentModel.find({ userId: userObjectId }).populate('courseId').exec();
  }

  async getEnrollmentsByCourse(courseId: string) {
    const course = await this.courseModel.findOne({ courseId }).populate('modules');
    if (!course) {
      throw new NotFoundException("Course not found");
    }
  
    const enrollments = await this.enrollmentModel.find({ courseId: course._id }).populate('userId');
    return {
      course,
      enrollments,
    };
  }
  

  async findUserById(userId: string): Promise<User | null> {
    const userObjectId = new Types.ObjectId(userId);
    const user = await this.userModel.findById(userObjectId).exec();
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }
}
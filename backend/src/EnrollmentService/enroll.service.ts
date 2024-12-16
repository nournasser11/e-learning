import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from '../models/user.schema'; // Adjust the path based on your project structure
import { Course, CourseDocument } from '../models/courses.schema'; // Adjust the path based on your project structure
import mongoose from 'mongoose';
@Injectable()
export class EnrollmentService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
    @InjectModel(Course.name) private readonly courseModel: Model<CourseDocument>,
  ) {}

  async enroll(userId: string, courseId: string): Promise<any> {
    const user = await this.userModel.findById(userId); // Fetch the user by ID
    const course = await this.courseModel.findById(courseId); // Fetch the course by ID
  
    if (!user) {
      throw new NotFoundException('User not found');
    }
  
    if (!course) {
      throw new NotFoundException('Course not found');
    }
  
    // Convert courseId to ObjectId
    const courseObjectId = new mongoose.Types.ObjectId(courseId);
  
    if (user.enrolledCourses.includes(courseObjectId)) {
      throw new ConflictException('User already enrolled in this course');
    }
  
    // Add course to user's enrolled courses
    user.enrolledCourses.push(courseObjectId);
  
    // Add user to course's enrolled users
    course.enrolledUsers.push(userId);
  
    await user.save(); // Save the updated user
    await course.save(); // Save the updated course
  
    return { message: 'Enrolled successfully!' };
  }
  async getEnrolledCourses(userId: string): Promise<any> {
    const user = await this.userModel.findById(userId).populate('enrolledCourses'); // Populate enrolledCourses references
    if (!user) {
      throw new NotFoundException('User not found');
    }

    return { enrolledCourses: user.enrolledCourses }; // Return the populated enrolled courses
  }
}

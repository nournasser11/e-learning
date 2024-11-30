import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Course, CourseDocument } from '../models/courses.Schema';

@Injectable()
export class CoursesService {
  constructor(@InjectModel(Course.name) private courseModel: Model<CourseDocument>) {}

  // Create a new course
  async create(createCourseDto: any): Promise<Course> {
    const createdCourse = new this.courseModel(createCourseDto);
    return createdCourse.save();
  }

  // Get all courses
  async findAll(): Promise<Course[]> {
    return this.courseModel.find().exec();
  }

  // Get a course by its ID
  async findOne(courseId: string): Promise<Course | null> {
    return this.courseModel.findOne({ courseId }).exec();
  }

  async updateCourse(courseId: string, updateData: Partial<Course>): Promise<Course | null> {
    return this.courseModel.findByIdAndUpdate(courseId, updateData, { new: true }).exec();
  }
  

   // Delete a course
   async deleteCourse(id: string): Promise<void> {
    const result = await this.courseModel.findByIdAndDelete(id).exec();
    if (!result) {
      throw new HttpException('Course not found', HttpStatus.NOT_FOUND);
    }
  }
  
}
import { Injectable, HttpException, HttpStatus, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Course, CourseDocument } from '../models/courses.Schema';
import { Request } from 'express';
import { Multer } from 'multer';
import { Progress } from '../models/progress.Schema';
@Injectable()
export class CoursesService {
  constructor(
    @InjectModel(Course.name) private courseModel: Model<CourseDocument>,
    @InjectModel('Progress') private progressModel: Model<any>
  ) {}

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
  
  
  
    async findNumberOfEnrolledStudents(courseId: string): Promise<number> {
      const course = await this.courseModel.findOne({ courseId }).exec();
      return course ? course.enrolledStudents : 0;
    }
  
    async findNumberOfStudentsByPerformance(courseId: string, performance: string): Promise<number> {
      const performanceRange = this.getPerformanceRange(performance);
      const students = await this.progressModel.find({
        courseId,
        completionPercentage: { $gte: performanceRange.min, $lt: performanceRange.max },
      }).exec();
      return students.length;
    }
  
    async rateCourse(courseId: string, rating: number): Promise<Course> {
      const course = await this.courseModel.findOne({ courseId }).exec();
      if (!course) {
        throw new Error('Course not found');
      }
      course.ratings.push(rating);
      return course.save();
    }
  
    async findNumberOfStudentsCompletedCourse(courseId: string): Promise<number> {
      const course = await this.courseModel.findOne({ courseId }).exec();
      return course ? course.completedStudents : 0;
    }
  
    private getPerformanceRange(performance: string): { min: number; max: number } {
      switch (performance) {
        case 'low':
          return { min: 0, max: 50 };
        case 'medium':
          return { min: 50, max: 80 };
        case 'high':
          return { min: 80, max: 100 };
        default:
          throw new Error('Invalid performance measure');
      }
    }
    async addModuleToCourse(courseId: string, moduleId: string): Promise<Course> {
      const course = await this.courseModel.findOneAndUpdate(
        { courseId },
        { $push: { modules: moduleId } },
        { new: true },
      );
      if (!course) {
        throw new NotFoundException(`Course with ID ${courseId} not found`);
      }
      return course;
    }
    async updateCourseVersion(courseId: string, updateData: Partial<Course>): Promise<Course> {
      const course = await this.courseModel.findOne({ courseId }).exec();
      if (!course) {
        throw new NotFoundException('Course not found');
      }
  
      // Store the previous version
      course.previousVersions.push({
        title: course.title,
        description: course.description,
        updatedAt: course.updatedAt,
      });
  
      // Increment the version number
      course.version += 1;
  
      // Update the course
      Object.assign(course, updateData);
      return course.save();
    }
    async uploadCourseResources(courseId: string, files: Express.Multer.File[]): Promise<Course> {
      const course = await this.courseModel.findOne({ courseId }).exec();
      if (!course) {
        throw new NotFoundException('Course not found');
      }
  
      // Assuming files are stored locally, store their paths
      const resourcePaths = files.map(file => `/uploads/${file.filename}`);
      course.resources = [...course.resources, ...resourcePaths];
      return course.save();
    }
    async searchCourses(query: string): Promise<Course[]> {
      return this.courseModel.find({
        $or: [
          { title: { $regex: query, $options: 'i' } },
          { description: { $regex: query, $options: 'i' } },
          { category: { $regex: query, $options: 'i' } },
        ],
      }).exec();
    }
    async updateStudentProgress(userId: string, courseId: string, percentage: number): Promise<Progress> {
      const progress = await this.progressModel.findOneAndUpdate(
        { userId, courseId },
        { completionPercentage: percentage, completed: percentage === 100 },
        { new: true, upsert: true },
      ).exec();
      return progress;
    }
  } 
  

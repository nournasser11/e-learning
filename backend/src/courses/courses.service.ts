import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Course, CourseDocument, CourseStatus } from '../models/courses.Schema';
import { CreateCourseDto } from '../dto/create-course.dto';

@Injectable()
export class CourseService {
  constructor(@InjectModel(Course.name) private courseModel: Model<CourseDocument>) {}

  // Create new course
  async create(createCourseDto: CreateCourseDto): Promise<Course> {
    const newCourse = new this.courseModel(createCourseDto);
    return newCourse.save();
  }

  // Get all courses
  async findAll(): Promise<Course[]> {
    return this.courseModel.find().exec();
  }

  // Get course by ID
  async findOne(id: string): Promise<Course> {
    return this.courseModel.findById(id).exec();
  }

  // Mark course as deleted
  async markAsDeleted(id: string): Promise<Course> {
    return this.courseModel.findByIdAndUpdate(
      id,
      { status: CourseStatus.DELETED },
      { new: true }
    ).exec();
  }

  // Update course status (valid, invalid, deleted)
  async updateStatus(id: string, status: CourseStatus): Promise<Course> {
    const course = await this.courseModel.findById(id);
    if (!course) {
      throw new HttpException(`Course with ID ${id} not found`, HttpStatus.NOT_FOUND);
    }

    course.status = status; // Update status
    return course.save();
  }

  // Search courses by title
  async searchByTitle(title: string): Promise<Course[]> {
    const regex = new RegExp(title, 'i'); // Case-insensitive regex search
    return this.courseModel.find({ title: { $regex: regex } }).exec();
  }

  // Get count of students who completed courses by instructorId
  async getCompletedCoursesByInstructor(instructorId: string) {
    return this.courseModel.aggregate([
      { $match: { instructor: new Types.ObjectId(instructorId) } },
      { $project: { title: 1, completedStudents: 1 } },
      { $addFields: { completedCount: { $size: { $ifNull: ["$completedStudents", []] } } } },
      { $sort: { completedCount: -1 } },
      { $project: { title: 1, completedCount: 1 } },
    ]);
  }

  // Get all courses by instructor ID
  async findAllByInstructor(instructorId: string): Promise<Course[]> {
    return this.courseModel.find({ instructor: instructorId }).exec();
  }
}

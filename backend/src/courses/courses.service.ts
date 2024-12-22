import { Injectable, HttpException, HttpStatus, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';

import { Course, CourseDocument, CourseStatus } from '../models/courses.Schema';

import { CreateCourseDto } from '../dto/create-course.dto';
import { UpdateCourseDto } from '../dto/update-course.dto';


@Injectable()
export class CourseService {
  constructor(@InjectModel(Course.name) private courseModel: Model<CourseDocument>) { }

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

  async findOne(courseId: string): Promise<Course> {
    try {
      // Use populate to fetch related data
      const course = await this.courseModel
        .findById(courseId)
        .populate('modules') // Populate modules if referenced in the schema
        .populate('completedStudents', 'name email') // Fetch only specific fields (e.g., name, email)
        .populate('assignedStudents', 'name email') // Fetch only specific fields
        .exec();

      if (!course) {
        throw new NotFoundException(`Course with ID ${courseId} not found.`);
      }

      return course; // Return the course with populated data
    } catch (error) {
      console.error(`Error fetching course with ID ${courseId}:`, (error as Error).message || error);
      throw new HttpException('Failed to fetch course', HttpStatus.INTERNAL_SERVER_ERROR);
    }
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

  async updateCourse(id: string, updateCourseDto: UpdateCourseDto): Promise<Course> {
    const course = await this.courseModel.findById(id);
    if (!course) {
      throw new NotFoundException(`Course with ID ${id} not found.`);
    }

    // Update fields conditionally
    if (updateCourseDto.title) course.title = updateCourseDto.title;
    if (updateCourseDto.description) course.description = updateCourseDto.description;
    if (updateCourseDto.version) course.version = updateCourseDto.version;

    try {
      return await course.save();
    } catch (error) {
      throw new HttpException(
        `Failed to update course: ${(error as Error).message}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
  // Search courses by title
  async searchByTitle(title: string): Promise<Course[]> {
    const regex = new RegExp(title, 'i'); // Case-insensitive regex search
    return this.courseModel.find({ title: { $regex: regex } }).exec();
  }

  // Get count of students who completed courses by instructorId
  async getCompletedCoursesByInstructor(instructorId: string) {
    return this.courseModel.aggregate([
      { $match: { instructor: new Types.ObjectId(instructorId) } },  // Match courses for a specific instructor
      { $project: { title: 1, completedStudents: 1 } },  // Project the title and completed students fields
      { $addFields: { completedCount: { $size: { $ifNull: ["$completedStudents", []] } } } },  // Add a new field `completedCount` to store the count of completed students
      { $sort: { completedCount: -1 } },  // Sort by completedCount in descending order
      { $project: { title: 1, completedCount: 1 } }  // Only return the title and completedCount fields
    ]);
  }

  // Get all courses by instructor ID
  async findAllByInstructor(instructorId: string): Promise<Course[]> {
    return this.courseModel.find({ instructor: instructorId }).exec();
  }

  async remove(id: string): Promise<Course> {
    return this.courseModel.findByIdAndDelete(id).exec();
  }

  // Method to search courses by title

  async searchByTitleAndInstructor(title: string, instructorId: string): Promise<Course[]> {
    const regex = new RegExp(title, 'i'); // Case-insensitive regex for title
    return this.courseModel
      .find({
        title: { $regex: regex },
        instructor: instructorId, // Filter by instructor ID
      })
      .exec();
  }


}
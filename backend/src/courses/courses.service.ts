import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Course, CourseDocument } from '../models/courses.Schema';
import { CreateCourseDto } from '../dto/create-course.dto';
import { UpdateCourseDto } from '../dto/update-course.dto';
import { HttpException, HttpStatus } from '@nestjs/common';

@Injectable()
export class CourseService {
    constructor(@InjectModel(Course.name) private courseModel: Model<CourseDocument>) {}

    async create(createCourseDto: CreateCourseDto): Promise<Course> {
      const newCourse = new this.courseModel(createCourseDto); // Mongo will generate _id for courseId
      return newCourse.save();
    }
    

    async findAll(): Promise<Course[]> {
        return this.courseModel.find().exec();
    }

    // async findOne(id: string): Promise<Course | null> {
    //   try {
    //     const course = await this.courseModel.findById(id).exec();
    //     if (!course) {
    //       return null;
    //     }
    //     return course;
    //   } catch (error) {
    //     // Handle potential errors like invalid ObjectId errors
    //     console.error(`Error fetching course with ID ${id}:`, error);
    //     throw new Error('Database fetch error');
    //   }
    // }

    async findOne(courseId: string): Promise<Course> {
      const course = await this.courseModel.findById(courseId).exec();
    
      if (!course) {
        throw new NotFoundException(`Course with ID ${courseId} not found.`);
      }
    
      return course; // Return the course with module IDs
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


    async remove(id: string): Promise<Course> {
        return this.courseModel.findByIdAndDelete(id).exec();
    }

    async markAsDeleted(id: string): Promise<Course> {
      return this.courseModel.findByIdAndUpdate(
          id,
          { status: 'deleted' },
          { new: true }
      ).exec();
  }

   // Method to search courses by title
   async searchByTitle(title: string): Promise<Course[]> {
    const regex = new RegExp(title, 'i');  // Create a case-insensitive regex pattern
    return this.courseModel.find({ title: { $regex: regex } }).exec();  // Search courses by title
  }

  async searchByTitleAndInstructor(title: string, instructorId: string): Promise<Course[]> {
  const regex = new RegExp(title, 'i'); // Case-insensitive regex for title
  return this.courseModel
    .find({
      title: { $regex: regex },
      instructor: instructorId, // Filter by instructor ID
    })
    .exec();
}


  // Method to get count of students who completed courses by instructorId
  async getCompletedCoursesByInstructor(instructorId: string) {
    return this.courseModel.aggregate([
      { $match: { instructor: new Types.ObjectId(instructorId) } },  // Match courses for a specific instructor
      { $project: { title: 1, completedStudents: 1 } },  // Project the title and completed students fields
      { $addFields: { completedCount: { $size: { $ifNull: ["$completedStudents", []] } } } },  // Add a new field `completedCount` to store the count of completed students
      { $sort: { completedCount: -1 } },  // Sort by completedCount in descending order
      { $project: { title: 1, completedCount: 1 } }  // Only return the title and completedCount fields
    ]);
  }

  async findAllByInstructor(instructorId: string): Promise<Course[]> {
    const courses = await this.courseModel.find({ instructor: instructorId }).exec();
    console.log(`Courses found for instructor ${instructorId}:`, courses);
    return courses;
  }

  async findById(courseId: string): Promise<Course> {
    const course = await this.courseModel
      .findById(courseId)
      .populate('modules') // Populate modules array with full module details
      .exec();
  
    if (!course) {
      throw new NotFoundException(`Course with ID ${courseId} not found.`);
    }
  
    return course;
  }
  
}  

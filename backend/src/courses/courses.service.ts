import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Course, CourseDocument } from '../models/courses.Schema';
import { CreateCourseDto } from '../dto/create-course.dto';


@Injectable()
export class CourseService {
    constructor(@InjectModel(Course.name) private courseModel: Model<CourseDocument>) {}

    async create(createCourseDto: CreateCourseDto): Promise<Course> {
      const newCourse = new this.courseModel(createCourseDto); // Mongo will generate _id for courseId
      return newCourse.save();
    }

    async getCourseById(id: string): Promise<Course> {
      if (!Types.ObjectId.isValid(id)) {
        throw new NotFoundException(`Invalid course ID: ${id}`);
      }
  
      const course = await this.courseModel.findById(new Types.ObjectId(id)).exec();
      if (!course) {
        throw new NotFoundException(`Course not found with ID: ${id}`);
      }
  
      return course;
    }
    
    

    async findAll(): Promise<Course[]> {
        return this.courseModel.find().exec();
    }

    async findOne(id: string): Promise<Course> {
        return this.courseModel.findById(id).exec();
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
    const regex = new RegExp(title, 'i'); // Case-insensitive search
    return this.courseModel.find({ title: { $regex: regex } }).exec();
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
}  

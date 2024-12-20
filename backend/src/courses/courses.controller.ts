import { Controller, Get, Post, Put, Delete, Body, Param, Query, HttpException, HttpStatus } from '@nestjs/common';
import { CourseService } from './courses.service';
import { Course } from '../models/courses.Schema';
import { CreateCourseDto } from '../dto/create-course.dto';
import { CourseStatus } from '../models/courses.Schema';

@Controller('courses')
export class CourseController {
  constructor(private readonly courseService: CourseService) { }

  // Add new course (working)
  @Post()
  async create(@Body() createCourseDto: CreateCourseDto): Promise<Course> {
    return this.courseService.create(createCourseDto);
  }

  // Get all courses (working)
  @Get()
  async findAll(): Promise<Course[]> {
    return this.courseService.findAll();
  }

  // Get course by ID (working)
  @Get('/Cbyid/:id')
  async findOne(@Param('id') id: string): Promise<Course> {
    return this.courseService.findOne(id);
  }

  // Update course status (valid, invalid, deleted)
  @Put('/status/:id')
  async updateStatus(
    @Param('id') id: string,
    @Body('status') status: CourseStatus
  ): Promise<Course> {
    // Validate status value
    if (!Object.values(CourseStatus).includes(status)) {
      throw new HttpException('Invalid status value. Use VALID, INVALID, or DELETED.', HttpStatus.BAD_REQUEST);
    }
    return this.courseService.updateStatus(id, status);
  }

  // Update course status to deleted (working)
  @Put('/delete/:id')
  async markAsDeleted(@Param('id') id: string): Promise<Course> {
    return this.courseService.markAsDeleted(id);
  }

  // Search courses by title (working)
  @Get('search')
  async search(@Query('title') title: string): Promise<Course[]> {
    return this.courseService.searchByTitle(title);
  }

  // Get count of students who completed courses by instructorId (working)
  @Get('completed/:instructorId')
  async getCompletedCoursesByInstructor(@Param('instructorId') instructorId: string) {
    return this.courseService.getCompletedCoursesByInstructor(instructorId);
  }

  // Get all courses by instructorId (working)
  @Get('/by-instructor/:instructorId')
  async findAllByInstructor(@Param('instructorId') instructorId: string): Promise<Course[]> {
    try {
      return this.courseService.findAllByInstructor(instructorId);
    } catch (error) {
      console.error('Failed to find courses:', error);
      throw new HttpException('Failed to find courses', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
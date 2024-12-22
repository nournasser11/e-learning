import { Controller, Get, Post, Put, Delete, Body, Param, Query, HttpException, HttpStatus, NotFoundException, BadRequestException } from '@nestjs/common';
import { CourseService } from './courses.service';
import { Course } from '../models/courses.Schema';
import { CreateCourseDto } from '../dto/create-course.dto';
import { CourseStatus } from '../models/courses.Schema';
import { UpdateCourseDto } from '../dto/update-course.dto';

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

  // get course by id(working)
  @Get('/Cbyid/:id')
  async findOne(@Param('id') id: string): Promise<Course> {
    try {
      const course = await this.courseService.findOne(id); // Call service to fetch the course

      if (!course) {
        // If no course is found, throw a 404 error
        throw new NotFoundException(`Course with ID ${id} not found.`);
      }

      return course; // Return the fetched course
    } catch (error) {
      // Log the error internally
      console.error('Error fetching course with ID:', id, (error as any).message || error);

      // Check if the error is already an HTTP exception
      if (!(error instanceof HttpException)) {
        throw new HttpException(
          'Failed to fetch course',
          HttpStatus.INTERNAL_SERVER_ERROR
        );
      }

      throw error; // Re-throw the original error if it was an HTTP exception
    }
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

  @Put('/update/:id')
  async updateCourse(
    @Param('id') id: string,
    @Body() updateCourseDto: UpdateCourseDto
  ): Promise<Course> {
    const updatedCourse = await this.courseService.updateCourse(id, updateCourseDto);
    if (!updatedCourse) {
      throw new NotFoundException(`Course with ID ${id} not found.`);
    }
    return updatedCourse;
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

  @Get('searchi')
  async searchi(
    @Query('title') title: string,
    @Query('instructorId') instructorId: string
  ): Promise<Course[]> {
    if (!instructorId) {
      throw new BadRequestException("Instructor ID is required for search.");
    }
    return this.courseService.searchByTitleAndInstructor(title, instructorId);
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
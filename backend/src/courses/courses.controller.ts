import { Controller, Get, Post, Put, Delete, Body, Param, Query, HttpException, HttpStatus, NotFoundException, BadRequestException } from '@nestjs/common';
import { CourseService } from './courses.service';
import { Course } from '../models/courses.Schema';
import { CreateCourseDto} from '../dto/create-course.dto';
import { UpdateCourseDto } from '../dto/update-course.dto';

@Controller('courses')
export class CourseController {
    constructor(private readonly courseService: CourseService) {}
    
    // add new course(working) 
    @Post()
    async create(@Body() createCourseDto: CreateCourseDto): Promise<Course> {
      return this.courseService.create(createCourseDto);
    }


    // get all courses(working)
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
        console.error('Error fetching course with ID:', id, error);
    
        // Check if the error is already an HTTP exception
        if (!(error instanceof HttpException)) {
          throw new HttpException('Failed to fetch course', HttpStatus.INTERNAL_SERVER_ERROR);
        }
    
        throw error; // Re-throw the original error if it was an HTTP exception
      }
    
    
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


    // update course satus to deleted (working)
    @Put('/delete/:id')
    async markAsDeleted(@Param('id') id: string): Promise<Course> {
        return this.courseService.markAsDeleted(id);
    }

    // search that when a user enters a title, it returns all courses that contain that title(working)
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


  // get count of students who completed courses by instructorId(working)
  @Get('completed/:instructorId')
  async getCompletedCoursesByInstructor(@Param('instructorId') instructorId: string) {
    return this.courseService.getCompletedCoursesByInstructor(instructorId);
  }

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

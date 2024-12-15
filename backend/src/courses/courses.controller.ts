import { Controller, Get, Post, Put, Delete, Body, Param, Query, HttpException, HttpStatus } from '@nestjs/common';
import { CourseService } from './courses.service';
import { Course } from '../models/courses.Schema';
import { CreateCourseDto} from '../dto/create-course.dto';

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
        return this.courseService.findOne(id);
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

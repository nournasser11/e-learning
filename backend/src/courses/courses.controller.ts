import { Controller, Get, Post, Body, Param, Put, Delete } from '@nestjs/common';
import { CoursesService } from './courses.service';

@Controller('courses')
export class CoursesController {
  constructor(private readonly coursesService: CoursesService) {}

  // Create a new course
  @Post()
  async create(@Body() createCourseDto: any) {
    return this.coursesService.create(createCourseDto);
  }

  // Get all courses
  @Get()
  async findAll() {
    return this.coursesService.findAll();
  }

  // Get a course by courseId
  @Get(':courseId')
  async findOne(@Param('courseId') courseId: string) {
    return this.coursesService.findOne(courseId);
  }

  // Update a course
  @Put(':courseId')
  async update(
    @Param('courseId') courseId: string,
    @Body() updateCourseDto: any,
  ) {
    return this.coursesService.updateCourse(courseId, updateCourseDto);
  }

  // Delete a course
  @Delete(':courseId')
  async remove(@Param('courseId') courseId: string) {
    return this.coursesService.deleteCourse(courseId);
  }
}
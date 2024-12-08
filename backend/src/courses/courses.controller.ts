import { Controller, Get, Post, Body, Param, Put, Delete, BadRequestException } from '@nestjs/common';
import { CoursesService } from './courses.service';
import { Course } from 'src/models/courses.Schema';

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

@Controller('courses')
export class CourseController {
  constructor(private readonly courseService: CoursesService) {}

  @Get(':courseId/enrolled-students')
  findNumberOfEnrolledStudents(@Param('courseId') courseId: string) {
    return this.courseService.findNumberOfEnrolledStudents(courseId);
  }

  @Get(':courseId/students-by-performance/:performance')
  findNumberOfStudentsByPerformance(
    @Param('courseId') courseId: string,
    @Param('performance') performance: string,
  ) {
    return this.courseService.findNumberOfStudentsByPerformance(courseId, performance);
  }

  @Post(':courseId/rate')
  rateCourse(@Param('courseId') courseId: string, @Body('rating') rating: number) {
    return this.courseService.rateCourse(courseId, rating);
  }

  @Get(':courseId/completed-students')
  findNumberOfStudentsCompletedCourse(@Param('courseId') courseId: string) {
    return this.courseService.findNumberOfStudentsCompletedCourse(courseId);
  }
  @Put(':courseId/modules/:moduleId')
  async addModuleToCourse(
    @Param('courseId') courseId: string,
    @Param('moduleId') moduleId: string,
  ): Promise<Course> {
    return await this.courseService.addModuleToCourse(courseId, moduleId);
  }

  @Post(':courseId/assign')
  async assignUserToCourse(
    @Param('courseId') courseId: string,
    @Body('userId') userId: string,
  ): Promise<Course> {
    if (!userId) {
      throw new BadRequestException('User ID is required');
    }

    return this.courseService.assignUserToCourse(courseId, userId);
  }
}

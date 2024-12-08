
import { CoursesService } from './courses.service';
import { Course } from 'src/models/courses.Schema';
import { Controller, Post,Get,Put,Delete, UseInterceptors, UploadedFiles, Body, Param, Query } from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
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
  @Get(':courseId/enrolled-students')
  findNumberOfEnrolledStudents(@Param('courseId') courseId: string) {
    return this.coursesService.findNumberOfEnrolledStudents(courseId);
  }

  @Get(':courseId/students-by-performance/:performance')
  findNumberOfStudentsByPerformance(
    @Param('courseId') courseId: string,
    @Param('performance') performance: string,
  ) {
    return this.coursesService.findNumberOfStudentsByPerformance(courseId, performance);
  }

  @Post(':id/rate')
  async rateCourse(@Param('id') courseId: string, @Body('rating') rating: number): Promise<Course> {
    return this.coursesService.rateCourse(courseId, rating);
  }

  @Get(':courseId/completed-students')
  findNumberOfStudentsCompletedCourse(@Param('courseId') courseId: string) {
    return this.coursesService.findNumberOfStudentsCompletedCourse(courseId);
  }

  @Put(':courseId/modules/:moduleId')
  async addModuleToCourse(
    @Param('courseId') courseId: string,
    @Param('moduleId') moduleId: string,
  ): Promise<Course> {
    return await this.coursesService.addModuleToCourse(courseId, moduleId);
  }
}

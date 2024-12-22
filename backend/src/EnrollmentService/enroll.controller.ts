import { Controller, Post, Get, Body, Param, NotFoundException } from '@nestjs/common';
import { EnrollmentService } from './enroll.service';
import { Course } from 'src/models/courses.Schema';

@Controller('enrollment')
export class EnrollmentController {
  constructor(private readonly enrollmentService: EnrollmentService) {}

  @Post('enroll')
  async enroll(@Body() body: { userId: string; courseId: string }) {
    return this.enrollmentService.enroll(body.userId, body.courseId);
  }

  
  @Get(':userId/courses')
  async getEnrolledCourses(@Param('userId') userId: string): Promise<Course[]> {
    return this.enrollmentService.getEnrolledCourses(userId);
  }

  @Get('course/:courseId')
  async getEnrollmentsByCourse(@Param('courseId') courseId: string) {
    return this.enrollmentService.getEnrollmentsByCourse(courseId);
  }

  @Get('user/find/:userId')
  async findUserById(@Param('userId') userId: string) {
    const user = await this.enrollmentService.findUserById(userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }
}

import { Controller, Post, Get, Body, Param } from '@nestjs/common';
import { EnrollmentService } from '../EnrollmentService/enroll.service';
import { Course } from '../models/courses.Schema'

@Controller('enrollment') // Base route for enrollment
export class EnrollmentController {
  constructor(private readonly enrollmentService: EnrollmentService) {}

  // POST route to enroll a user in a course
  @Post('enroll')
  async enroll(@Body() body: { userId: string; courseId: string }) {
    return this.enrollmentService.enroll(body.userId, body.courseId);
  }

  // GET route to fetch enrolled courses of a user
  @Get(':userId/courses')
  async getEnrolledCourses(@Param('userId') userId: string): Promise<Course[]> {
    return this.enrollmentService.getEnrolledCourses(userId);
  }
}


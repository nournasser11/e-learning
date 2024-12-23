import { Controller, Post, Get, Body, Param, NotFoundException } from '@nestjs/common';
import { EnrollmentService } from './enroll.service';

@Controller('enrollment')
export class EnrollmentController {
  constructor(private readonly enrollmentService: EnrollmentService) {}

  @Post()
  async enrollUser(@Body('userId') userId: string, @Body('courseId') courseId: string) {
    try {
      const enrollment = await this.enrollmentService.enroll(userId, courseId);
      return {
        message: "Enrollment successful",
        enrollment,
      };
    } catch (error) {
      console.error("Error handling enrollment request:", (error as any).message || error);
      throw error; // Forward the error to be handled by NestJS
    }
  }
  

  @Get('user/:userId')
  async getEnrollmentsByUser(@Param('userId') userId: string) {
    return this.enrollmentService.getEnrollmentsByUser(userId);
  }

  @Get('course/:courseId')
  async getEnrollmentsByCourse(@Param('courseId') courseId: string) {
    try {
      const data = await this.enrollmentService.getEnrollmentsByCourse(courseId);
      return data;
    } catch (error) {
      console.error('Error handling getEnrollmentsByCourse request:', (error as any).message || error);
      throw error;
    }
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
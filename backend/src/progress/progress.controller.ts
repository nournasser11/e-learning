import { Controller } from '@nestjs/common';
import { Get, Param } from '@nestjs/common';
import { ProgressService } from './progress.service';


@Controller('progress')
export class ProgressController {
    constructor(private readonly progressService: ProgressService) {}

    @Get('student/:userId')
    getStudentProgress(@Param('userId') userId: string) {
        return this.progressService.getStudentProgress(userId);
    }

    @Get('instructor/:courseId')
    getInstructorAnalytics(@Param('courseId') courseId: string) {
        return this.progressService.getInstructorAnalytics(courseId);
    }
}
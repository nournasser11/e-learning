import { Body, Controller, Post, Put } from '@nestjs/common';
import { Get, Param } from '@nestjs/common';
import { ProgressService } from './progress.service';
import { CreateProgressDto } from '../dto/create-progress.dto';
import { UpdateProgressDto } from '../dto/update-progress.dto';


@Controller('progress')
export class ProgressController {
    constructor(private readonly progressService: ProgressService) { }

    // Get student progress by userId and courseId
    @Get(':userId/:courseId')
    async getProgress(
        @Param('userId') userId: string,
        @Param('courseId') courseId: string,
    ) {
        return this.progressService.getStudentProgress(userId, courseId);
    }

    @Post()
    async createProgress(@Body() createProgressDto: CreateProgressDto) {
        return this.progressService.createProgress(createProgressDto);
    }

    @Get('instructor/:courseId')
    getInstructorAnalytics(@Param('courseId') courseId: string) {
        return this.progressService.getInstructorAnalytics();
    }
    // Update existing progress record
    @Put(':userId/:courseId')
    async updateProgress(
        @Param('userId') userId: string,
        @Param('courseId') courseId: string,
        @Body() updateProgressDto: UpdateProgressDto,
    ) {
        return this.progressService.updateStudentProgress(
            userId,
            courseId,
            updateProgressDto,
        );
    }
    // Create a new progress record

}
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CourseService } from './courses.service';
import { CourseController } from './courses.controller';
import { Course, CourseSchema } from '../models/courses.schema';
import { Progress, ProgressSchema } from '../models/progress.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Course.name, schema: CourseSchema }]),
    MongooseModule.forFeature([{ name: Progress.name, schema: ProgressSchema }]),
  ],
  controllers: [CourseController],
  providers: [CourseService],
  exports: [MongooseModule], // Export MongooseModule so it can be used in other modules
})
export class CourseModule { }

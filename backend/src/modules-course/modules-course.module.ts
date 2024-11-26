import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Module as CourseModule, ModuleSchema } from '../models/modules.Schema';
import { ModulesCourseService } from './modules-course.service';
import { ModulesCourseController } from './modules-course.controller';

@Module({
  imports: [MongooseModule.forFeature([{ name: CourseModule.name, schema: ModuleSchema }])],
  controllers: [ModulesCourseController],
  providers: [ModulesCourseService],
  exports: [ModulesCourseService],
})
export class ModulesModule {}

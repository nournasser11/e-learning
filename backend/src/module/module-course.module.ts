import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ModulesController } from './module-course.controller';
import { ModulesService } from './module-course.service';
import { ModuleSchema } from 'src/models/modules.Schema';
import { CourseSchema } from 'src/models/courses.Schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Module', schema: ModuleSchema }]),
    MongooseModule.forFeature([{ name: 'Course', schema: CourseSchema }]),
  ],
  controllers: [ModulesController],
  providers: [ModulesService],
})
export class ModuleCourseModule {}
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Module as CourseModule, ModuleSchema } from '../models/modules.Schema';
import { ModuleService } from './module-course.service';
import { ModuleController } from './module-course.controller';

@Module({
  imports: [MongooseModule.forFeature([{ name: CourseModule.name, schema: ModuleSchema }])],
  controllers: [ModuleController],
  providers: [ModuleService],
  exports: [ModuleService],
})
export class ModulesModule {}

import { Controller, Post, Get, Put, Param, Body } from '@nestjs/common';
import { ModulesService } from './module-course.service';
import { CreateModuleDto } from 'src/dto/create-module.dto';
import { UpdateModuleDto } from 'src/dto/update-module.dto';

@Controller('courses/:courseId/modules')
export class ModulesController {
  constructor(private readonly modulesService: ModulesService) {}

  @Post()
  async createModule(
    @Param('courseId') courseId: string,
    @Body() createModuleDto: Omit<CreateModuleDto, 'courseId'>
  ) {
    const moduleWithCourseId = { ...createModuleDto, courseId };
    return this.modulesService.create(moduleWithCourseId);
  }

  @Post(':moduleId/generate-quiz')
  async generateQuiz(@Param('moduleId') moduleId: string) {
    return this.modulesService.generateQuiz(moduleId);
  }

  @Get(':moduleId')
  async getModuleById(
    @Param('courseId') courseId: string,
    @Param('moduleId') moduleId: string
  ) {
    return this.modulesService.findById(courseId, moduleId);
  }

  @Put(':moduleId')
  async updateModule(
    @Param('courseId') courseId: string,
    @Param('moduleId') moduleId: string,
    @Body() updateModuleDto: UpdateModuleDto
  ) {
    return this.modulesService.update(courseId, moduleId, updateModuleDto);
  }

  @Put(':moduleId/flag')
  async flagResource(@Param('moduleId') moduleId: string) {
    return this.modulesService.flagResource(moduleId);
  }
}
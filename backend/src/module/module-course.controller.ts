import { Controller, Post, Get, Put, Delete, Param, Body, Query } from '@nestjs/common';
import { ModuleService } from './module-course.service';
import { Module } from '../models/modules.schema';

@Controller('modules')
export class ModuleController {
  constructor(private readonly moduleService: ModuleService) {}

  @Post()
  async createModule(@Body() createModuleDto: Partial<Module>): Promise<Module> {
    return this.moduleService.createModule(createModuleDto);
  }

  @Put(':id')
  async updateModule(@Param('id') moduleId: string, @Body() updateModuleDto: Partial<Module>): Promise<Module> {
    return this.moduleService.updateModule(moduleId, updateModuleDto);
  }

  @Post(':moduleId/courses')
  async addCourseToModule(@Param('moduleId') moduleId: string, @Body('courseId') courseId: string): Promise<Module> {
    return this.moduleService.addCourseToModule(moduleId, courseId);
  }

  @Get('search')
  async searchModules(@Query('query') query: string): Promise<Module[]> {
    return this.moduleService.searchModules(query);
  }
}
import {
    Controller,
    Get,
    Post,
    Put,
    Delete,
    Body,
    Param,
    Query,
  } from '@nestjs/common';
  import { ModuleService } from './module-course.service';
  import { CreateModuleDto } from '../dto/create-module.dto';
  import { UpdateModuleDto } from '../dto/update-module.dto';
  import { ModuleResponseDto } from '../dto/module-response.dto';
  
  @Controller('modules')
  export class ModuleController {
    constructor(private readonly moduleService: ModuleService) {}
  
    @Post()
    async createModule(
      @Body() createModuleDto: CreateModuleDto,
    ): Promise<ModuleResponseDto> {
      const module = await this.moduleService.createModule(createModuleDto);
      return {
        moduleId: module.moduleId,
        courseId: module.courseId,
        title: module.title,
        content: module.content,
        resources: module.resources || [],
        createdAt: module.createdAt,
        updatedAt: module.updatedAt,
      };
    }
  
    @Put(':moduleId')
    async updateModule(
      @Param('moduleId') moduleId: string,
      @Body() updateModuleDto: UpdateModuleDto,
    ): Promise<ModuleResponseDto> {
      const module = await this.moduleService.updateModule(moduleId, updateModuleDto);
      return {
        moduleId: module.moduleId,
        courseId: module.courseId,
        title: module.title,
        content: module.content,
        resources: module.resources || [],
        createdAt: module.createdAt,
        updatedAt: module.updatedAt,
      };
    }
  
    @Get(':moduleId')
    async getModuleById(
      @Param('moduleId') moduleId: string,
    ): Promise<ModuleResponseDto> {
      const module = await this.moduleService.getModuleById(moduleId);
      return {
        moduleId: module.moduleId,
        courseId: module.courseId,
        title: module.title,
        content: module.content,
        resources: module.resources || [],
        createdAt: module.createdAt,
        updatedAt: module.updatedAt,
      };
    }
  
    @Delete(':moduleId')
    async deleteModule(@Param('moduleId') moduleId: string): Promise<void> {
      return await this.moduleService.deleteModule(moduleId);
    }
  
    @Get('search')
    async searchModules(@Query('query') query: string): Promise<ModuleResponseDto[]> {
      const modules = await this.moduleService.searchModules(query);
      return modules.map(module => ({
        moduleId: module.moduleId,
        courseId: module.courseId,
        title: module.title,
        content: module.content,
        resources: module.resources || [],
        createdAt: module.createdAt,
        updatedAt: module.updatedAt,
      }));
    }
  }
  
import { Injectable, NotFoundException, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Module, ModuleDocument } from '../models/modules.schema';
import { Course, CourseDocument } from '../models/courses.schema';

@Injectable()
export class ModuleService {
  private readonly logger = new Logger(ModuleService.name);

  constructor(
    @InjectModel(Module.name) private moduleModel: Model<ModuleDocument>,
    @InjectModel(Course.name) private courseModel: Model<CourseDocument>,
  ) {}

  async createModule(createModuleDto: Partial<Module>): Promise<ModuleDocument> {
    const createdModule = new this.moduleModel(createModuleDto);
    return await createdModule.save();
  }

  async updateModule(
    moduleId: string,
    updateModuleDto: Partial<Module>,
  ): Promise<ModuleDocument> {
    return this.moduleModel.findByIdAndUpdate(moduleId, updateModuleDto, { new: true }).exec();
  }

  async addCourseToModule(moduleId: string, courseId: string): Promise<ModuleDocument> {
    this.logger.log(`Adding course ${courseId} to module ${moduleId}`);

    const module = await this.moduleModel.findById(moduleId).exec();
    if (!module) {
      this.logger.error(`Module not found: ${moduleId}`);
      throw new NotFoundException(`Module with ID ${moduleId} not found`);
    }

    const course = await this.courseModel.findById(courseId).exec();
    if (!course) {
      this.logger.error(`Course not found: ${courseId}`);
      throw new NotFoundException('Course not found');
    }

    module.courses.push(courseId);
    return module.save();
  }

  async searchModules(query: string): Promise<ModuleDocument[]> {
    return this.moduleModel.find({ title: { $regex: query, $options: 'i' } }).exec();
  }
  async updateModuleVersion(moduleId: string, updateData: Partial<Module>): Promise<ModuleDocument> {
    const module = await this.moduleModel.findById(moduleId).exec();
    if (!module) {
      throw new NotFoundException('Module not found');
    }

    // Store the previous version
    module.previousVersions.push({
      title: module.title,
      content: module.content,
      updatedAt: module.updatedAt,
    });

    // Increment the version number
    module.version += 1;

    // Update the module
    Object.assign(module, updateData);
    return module.save();
  }
}
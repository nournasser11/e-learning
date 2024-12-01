import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Module, ModuleDocument } from '../models/modules.Schema';

@Injectable()
export class ModuleService {
  constructor(
    @InjectModel(Module.name) private moduleModel: Model<ModuleDocument>,
  ) {}

  async createModule(createModuleDto: Partial<Module>): Promise<ModuleDocument> {
    const createdModule = new this.moduleModel(createModuleDto);
    return await createdModule.save();
  }

  async updateModule(
    moduleId: string,
    updateModuleDto: Partial<Module>,
  ): Promise<ModuleDocument> {
    const updatedModule = await this.moduleModel.findOneAndUpdate(
      { moduleId },
      updateModuleDto,
      { new: true },
    );
    if (!updatedModule) {
      throw new NotFoundException(`Module with ID ${moduleId} not found`);
    }
    return updatedModule;
  }

  async getModuleById(moduleId: string): Promise<ModuleDocument> {
    const module = await this.moduleModel.findOne({ moduleId });
    if (!module) {
      throw new NotFoundException(`Module with ID ${moduleId} not found`);
    }
    return module;
  }

  async deleteModule(moduleId: string): Promise<void> {
    const result = await this.moduleModel.deleteOne({ moduleId });
    if (result.deletedCount === 0) {
      throw new NotFoundException(`Module with ID ${moduleId} not found`);
    }
  }

  async searchModules(query: string): Promise<Partial<Module>[]> {
    return await this.moduleModel
      .find({ title: { $regex: query, $options: 'i' } })
      .lean();
  }
}

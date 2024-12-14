import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ModuleDocument, Module } from 'src/models/modules.Schema';
import { CreateModuleDto } from 'src/dto/create-module.dto';
import { UpdateModuleDto } from 'src/dto/update-module.dto';

@Injectable()
export class ModulesService {
  constructor(@InjectModel(Module.name) private moduleModel: Model<ModuleDocument>) {}

  async create(createModuleDto: CreateModuleDto): Promise<Module> {
    const newModule = new this.moduleModel(createModuleDto);
    return newModule.save();
  }

  async findById(courseId: string, moduleId: string): Promise<Module> {
    const module = await this.moduleModel.findOne({ courseId, _id: moduleId }).exec();
    if (!module) {
      throw new NotFoundException('Module with ID ${moduleId} not found in course ${courseId}');
    }
    return module;
  }

  async update(courseId: string, moduleId: string, updateModuleDto: UpdateModuleDto): Promise<Module> {
    const module = await this.moduleModel.findOneAndUpdate(
      { courseId, _id: moduleId },
      updateModuleDto,
      { new: true }
    ).exec();
    if (!module) {
      throw new NotFoundException('Module with ID ${moduleId} not found in course ${courseId}');
    }
    return module;
  }

  async generateQuiz(moduleId: string): Promise<{ quiz: any[] }> {
    const module = await this.moduleModel.findById(moduleId).exec();
    if (!module) {
      throw new NotFoundException('Module not found');
    }

    const { questionTypes, numberOfQuestions } = module.quizConfiguration;

    // Filter questions based on allowed types
    const questionBank = module.questionBank.filter((q) =>
      questionTypes.includes(q.type)
    );

    if (questionBank.length < numberOfQuestions) {
      throw new BadRequestException(
        `Not enough questions of the specified types (${questionTypes.join(
          ', '
        )}) in the question bank.`
      );
    }

    // Randomly select questions
    const selectedQuestions = questionBank
      .sort(() => 0.5 - Math.random())
      .slice(0, numberOfQuestions);

    return { quiz: selectedQuestions };
  }

  async flagResource(moduleId: string): Promise<Module> {
    const module = await this.moduleModel.findById(moduleId).exec();
    if (!module) {
      throw new NotFoundException('Module not found');
    }
    module.isFlagged = true;
    return module.save();
  }
}
import { Injectable, NotFoundException, BadRequestException, InternalServerErrorException,UploadedFile } from '@nestjs/common';
import mongoose from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { ModuleDocument, Module } from 'src/models/modules.Schema';
import { CourseDocument, Course } from 'src/models/courses.Schema'; // Import Course model
import { CreateModuleDto } from 'src/dto/create-module.dto';
import { UpdateModuleDto } from 'src/dto/update-module.dto';
import { QuestionDto } from 'src/dto/create-module.dto'; // Import QuestionDto

@Injectable()
export class ModulesService {
  constructor(
    @InjectModel(Module.name) private moduleModel: Model<ModuleDocument>,
    @InjectModel(Course.name) private courseModel: Model<CourseDocument>,
  ) {}

  private validateContentUrl(url: string): boolean {
    return /^https?:\/\/.+\..+/.test(url); // Move regex validation here
  }
  /**
   * Upload and store file URL
   */
  async uploadFile(@UploadedFile() file: Express.Multer.File) {
    console.log('Uploaded File:', file); // Add this line
    if (!file) {
      throw new BadRequestException('No file uploaded.');
    }
    const baseUrl = process.env.BASE_URL || 'http://localhost:3000';
    return { fileUrl: `${baseUrl}/uploads/${file.filename}` };
  }
  
  

  /**
   * Create a module and associate it with a course
   */
  async create(createModuleDto: CreateModuleDto): Promise<Module> {
    const { courseId, contentUrl } = createModuleDto;
  
    // Step 1: Validate the course
    const course = await this.courseModel.findById(courseId).exec();
    if (!course) {
      throw new NotFoundException(`Course with ID ${courseId} not found.`);
    }
  
    // Step 2: Validate the content URL (uploaded file or external URL)
    if (!contentUrl.startsWith('http://') && !contentUrl.startsWith('https://')) {
      throw new BadRequestException(`Invalid content URL: ${contentUrl}`);
    }
  
    // Step 3: Create the module
    const newModule = new this.moduleModel(createModuleDto);
  
    try {
      const savedModule = await newModule.save();
  
      // Associate the module with the course
      await this.courseModel.findByIdAndUpdate(
        courseId,
        { $addToSet: { modules: savedModule._id } }, // Prevent duplicate entries
        { new: true, useFindAndModify: false },
      );
  
      return savedModule;
    } catch (error) {
      console.error('Error creating module:', error);
      throw new BadRequestException('Failed to create module. Please try again.');
    }
  }
  

  
  
  async findById(courseId: string, moduleId: string) {
    console.log('Finding module for course:', courseId, 'and module ID:', moduleId); // Debug log
  
    if (!mongoose.Types.ObjectId.isValid(courseId) || !mongoose.Types.ObjectId.isValid(moduleId)) {
      throw new Error('Invalid courseId or moduleId format.');
    }
  
    return await this.moduleModel.findOne({
      _id: moduleId,
      courseId: courseId,
    }).exec();
  }
  

  async update(courseId: string, moduleId: string, updateModuleDto: UpdateModuleDto): Promise<Module> {
    const module = await this.moduleModel.findOneAndUpdate(
      { courseId, _id: moduleId },
      updateModuleDto,
      { new: true },
    ).exec();
    if (!module) {
      throw new NotFoundException(`Module with ID ${moduleId} not found in course ${courseId}`);
    }
    return module;
  }

  async deleteQuestion(courseId: string, moduleId: string, questionIndex: number) {
    const module = await this.moduleModel.findOne({ courseId, _id: moduleId });
    if (!module) throw new NotFoundException(`Module with ID ${moduleId} not found`);
  
    // Check if the question bank has at least 15 questions
    if (module.questionBank.length < 15) {
      throw new NotFoundException(`Cannot delete question: Minimum of 15 questions is required in the question bank.`);
    }
  
    // Validate the question index
    if (questionIndex < 0 || questionIndex >= module.questionBank.length) {
      throw new NotFoundException(`Invalid question index: ${questionIndex}`);
    }
  
    // Remove the question
    module.questionBank.splice(questionIndex, 1);
    return await module.save();
  }
  

  async generateQuiz(moduleId: string): Promise<{ quiz: any[] }> {
    const module = await this.moduleModel.findById(moduleId).exec();
    if (!module) {
      throw new NotFoundException('Module not found');
    }

    const { questionTypes, numberOfQuestions } = module.quizConfiguration;

    // Filter questions based on allowed types
    const questionBank = module.questionBank.filter((q) =>
      questionTypes.includes(q.type),
    );

    if (questionBank.length < numberOfQuestions) {
      throw new BadRequestException(
        `Not enough questions of the specified types (${questionTypes.join(', ')}) in the question bank.`,
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

  // Add a new question to a module
  async addQuestion(
    courseId: string,
    moduleId: string,
    questionDto: QuestionDto
  ): Promise<Module> {
    // Find the module with the specified courseId and moduleId
    const module = await this.moduleModel.findOne({
      _id: moduleId,
      courseId: courseId,
    });

    if (!module) {
      throw new NotFoundException(
        `Module with ID ${moduleId} not found in course ${courseId}`
      );
    }

    // Push the new question to the questionBank
    module.questionBank.push(questionDto);

    // Save the updated module document
    await module.save();

    return module;
  }
}



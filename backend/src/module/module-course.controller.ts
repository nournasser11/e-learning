import { Controller, Post,
   UseInterceptors, Get, Put, Delete, Param, Body,
    NotFoundException, InternalServerErrorException,UploadedFile,
     BadRequestException } from '@nestjs/common';
import { ModulesService } from './module-course.service';
import { CreateModuleDto } from 'src/dto/create-module.dto';
import { UpdateModuleDto } from 'src/dto/update-module.dto';
import { QuestionDto } from 'src/dto/create-module.dto';
import { ModuleDocument, Module } from 'src/models/modules.Schema';

import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { v4 as uuidv4 } from 'uuid';
import * as path from 'path';

const FILE_UPLOADS_DIR = './uploads';

export const fileNameEditor = (req: any, file: any, callback: (error: any, filename: string) => void) => {
  console.log('Inside fileNameEditor:', file.originalname);
  const newFileName = `${Date.now()}-${file.originalname}`;
  callback(null, newFileName);
};

export const imageFileFilter = (req: any, file: any, callback: (error: any, acceptFile: boolean) => void) => {
  console.log('Inside imageFileFilter:', file.mimetype);
  const allowedMimeTypes = ['application/pdf', 'image/jpeg', 'image/png'];
  if (!allowedMimeTypes.includes(file.mimetype)) {
    return callback(new BadRequestException(`Unsupported file type: ${file.mimetype}`), false);
  }
  callback(null, true);
};


@Controller('courses/:courseId/modules')
export class ModulesController {
  constructor(private readonly modulesService: ModulesService) {}

  
  @Post('pdf')
@UseInterceptors(
  FileInterceptor('file', {
    storage: diskStorage({
      destination: FILE_UPLOADS_DIR,
      filename: fileNameEditor,
    }),
    limits: {
      fileSize: 10 * 1024 * 1024, // 10MB file size limit
    },
    fileFilter: imageFileFilter,
  }),
)
async upload(
  @UploadedFile() file: Express.Multer.File,
  @Body() dto: Record<string, any>, // Allow any structure for debugging
) {
  if (!file) {
    throw new BadRequestException('No file uploaded.');
  }

  console.log('Uploaded File:', file); // Debugging log
  console.log('DTO:', dto); // Debugging log

  // If needed, validate the DTO structure here
  if (!dto.description) {
    throw new BadRequestException('Description is required in DTO.');
  }

  return {
    filename: file.filename,
    size: file.size,
    dto,
    filePath: `/uploads/${file.filename}`,
  };
}

  async uploadFile(@UploadedFile() file: Express.Multer.File) {
    if (!file) {
      throw new BadRequestException('No file uploaded.');
    }
    const baseUrl = process.env.BASE_URL || 'http://localhost:3000';
    const fileUrl = `${baseUrl}/uploads/${file.filename}`;

    // Example: You can save this file URL to the database or module metadata
    console.log('File uploaded successfully:', file.filename);

    return {
      message: 'File uploaded successfully',
      fileUrl,
    };
  }

  @Post('create')
  async createModule(
    @Param('courseId') courseId: string,
    @Body() createModuleDto: CreateModuleDto,
  ) {
    try {
      const moduleWithCourseId = { ...createModuleDto, courseId };
      return await this.modulesService.create(moduleWithCourseId);
    } catch (error) {
      console.error('Error creating module:', (error as any).message || error);
      throw error;
    }
  }




  @Post(':moduleId/generate-quiz')
  async generateQuiz(@Param('moduleId') moduleId: string) {
    return this.modulesService.generateQuiz(moduleId);
  }

   @Get(':moduleId')
  async getModuleById(
    @Param('courseId') courseId: string,
    @Param('moduleId') moduleId: string,
  ) {
    console.log('Course ID:', courseId);  // Debugging log
    console.log('Module ID:', moduleId);  // Debugging log
  
    const module = await this.modulesService.findById(courseId, moduleId);
    if (!module) {
      throw new NotFoundException(`Module with ID ${moduleId} not found in course ${courseId}`);
    }
    return module;
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

  @Delete(':moduleId/questions/:questionIndex')
  async deleteQuestionFromModule(
  @Param('courseId') courseId: string,
  @Param('moduleId') moduleId: string,
  @Param('questionIndex') questionIndex: number
) {
  const updatedModule = await this.modulesService.deleteQuestion(courseId, moduleId, +questionIndex);

  if (!updatedModule) {
    throw new NotFoundException(`Module with ID ${moduleId} not found in course ${courseId}`);
  }

  return {
    message: 'Question deleted successfully',
    module: updatedModule,
  };
}


  @Post(':moduleId/questions')
  async addQuestionToModule(
    @Param('courseId') courseId: string,
    @Param('moduleId') moduleId: string,
    @Body() questionDto: QuestionDto
  ) {
    const updatedModule = await this.modulesService.addQuestion(
      courseId,
      moduleId,
      questionDto
    );

    if (!updatedModule) {
      throw new NotFoundException(
        `Module with ID ${moduleId} not found in course ${courseId}`
      );
    }

    return {
      message: 'Question added successfully',
      module: updatedModule,
    };
  }
  @Get(':moduleId/content')
  async getModuleContent(
    @Param('courseId') courseId: string,
    @Param('moduleId') moduleId: string,
  ) {
    if (!moduleId || moduleId === 'undefined') {
      throw new BadRequestException('Module ID is required and cannot be undefined.');
    }
  
    console.log("Fetching module content for:", { courseId, moduleId }); // Debugging log
  
    // Call the service to get only the title and contentUrl
    const moduleContent = await this.modulesService.getModuleContent(courseId, moduleId);
    if (!moduleContent) {
      throw new NotFoundException(`Module with ID ${moduleId} not found in course ${courseId}`);
    }
  
    return {
      title: moduleContent.title,
      contentUrl: moduleContent.contentUrl,
    };
  }
}    
  



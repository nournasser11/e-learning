import {
    Controller,
    Post,
    Get,
    Delete,
    Param,
    Body,
    HttpException,
    HttpStatus,
  } from '@nestjs/common';
  import { QuizzesService } from './quizzes.service';
  import { GenerateQuizDto } from '../dto/generate-quiz.dto';
 import { Quiz } from '../models/quizzes.Schema';
  
  @Controller('quizzes')
  export class QuizController {
  }
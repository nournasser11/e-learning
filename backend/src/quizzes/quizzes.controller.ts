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
    constructor(private readonly quizService: QuizzesService) {}
  
    /**
     * Endpoint to generate a new quiz.
     * @param generateQuizDto - DTO containing userId, moduleId, questionCount, and questionTypes.
     * @returns The generated quiz document.
     */
    @Post('generate')
    async generateQuiz(@Body() generateQuizDto: GenerateQuizDto): Promise<Quiz> {
      try {
        return await this.quizService.generateQuiz(generateQuizDto);
      } catch (error) {
        throw new HttpException(
          'Error generating quiz: ' + error.message,
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
    }
  
    /**
     * Endpoint to retrieve all quizzes.
     * @returns A list of all quizzes in the database.
     */
    @Get()
    async getAllQuizzes(): Promise<Quiz[]> {
      try {
        return await this.quizService.getAllQuizzes();
      } catch (error) {
        throw new HttpException(
          'Error fetching quizzes: ' + error.message,
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
    }
  
    /**
     * Endpoint to retrieve a quiz by its ID.
     * @param id - The ID of the quiz to retrieve.
     * @returns The quiz document.
     */
    @Get(':id')
    async getQuizById(@Param('id') id: string): Promise<Quiz> {
      try {
        const quiz = await this.quizService.getQuizById(id);
        if (!quiz) {
          throw new HttpException('Quiz not found', HttpStatus.NOT_FOUND);
        }
        return quiz;
      } catch (error) {
        throw new HttpException(
          'Error fetching quiz: ' + error.message,
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
    }

    @Delete(':id')
  remove(@Param('id') id: string) {
    return this.quizService.deleteQuiz(id);
  }
  }
  
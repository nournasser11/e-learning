import { Controller, Post, Get, Delete, Param, Body } from '@nestjs/common';
import { QuizzesService } from './quizzes.service';
import { CreateQuizDto } from '../dto/create-quiz.dto';

@Controller('quizzes')
export class QuizzesController {
  constructor(private readonly quizzesService: QuizzesService) {}

  @Post()
  create(@Body() createQuizDto: CreateQuizDto) {
    return this.quizzesService.create(createQuizDto);
  }

  @Get()
  findAll() {
    return this.quizzesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.quizzesService.findOne(id);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.quizzesService.remove(id);
  }

  @Post('adaptive')
  generateAdaptiveQuiz(@Body('userId') userId: string, @Body('moduleId') moduleId: string) {
    return this.quizzesService.generateAdaptiveQuiz(userId, moduleId);
  }

  @Post('submit')
  async submitQuizResponse(
    @Body('userId') userId: string,
    @Body('quizId') quizId: string,
    @Body('answers') answers: any[],
  ) {
    const { response, feedback } = await this.quizzesService.submitQuizResponse(userId, quizId, answers);
    return { response, feedback };
  }
}
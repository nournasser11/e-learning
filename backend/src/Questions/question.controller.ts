import { Controller, Get, Post, Put, Delete, Body, Query, Param } from '@nestjs/common';
import { QuestionService } from './questions.service';
import { CreateQuestionDto } from '../dto/create-question.dto';
import { UpdateQuestionDto } from '../dto/update-question.dto';
import { FilterQuestionsDto } from '../dto/filter-questions.dto';

@Controller('questions')
export class QuestionController {
  constructor(private readonly questionService: QuestionService) {}

  /**
   * Create a new question.
   */
  @Post('create')
  async createQuestion(@Body() createQuestionDto: CreateQuestionDto) {
    return this.questionService.addQuestion(createQuestionDto);
  }

  /**
   * Fetch all questions or filter questions by criteria.
   */
  @Get()
  async getQuestions(@Query() filterQuestionsDto: FilterQuestionsDto) {
    if (Object.keys(filterQuestionsDto).length) {
      return this.questionService.filterQuestions(filterQuestionsDto);
    }
    return this.questionService.getAllQuestions();
  }

  /**
   * Get a specific question by its ID.
   */
  @Get(':id')
  async getQuestionById(@Param('id') id: string) {
    return this.questionService.getQuestionById(id);
  }

  /**
   * Update an existing question by ID.
   */
  @Put(':id')
  async updateQuestion(
    @Param('id') id: string,
    @Body() updateQuestionDto: UpdateQuestionDto,
  ) {
    const updateData = {
      ...updateQuestionDto,
      options: updateQuestionDto.options.map(option => ({ text: option, isCorrect: false }))
    };
    return this.questionService.updateQuestion(id, updateData);
  }

  /**
   * Delete a question by its ID.
   */
  @Delete(':id')
  async deleteQuestion(@Param('id') id: string) {
    await this.questionService.deleteQuestion(id);
    return { message: `Question with ID ${id} deleted successfully` };
  }
}

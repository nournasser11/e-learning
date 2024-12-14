import { IsString, IsArray, IsNotEmpty, IsIn, Min, ValidateNested, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';

export class QuizConfigurationDto {
  @IsArray()
  @IsIn(['MCQ', 'True/False'], { each: true })
  questionTypes: string[];

  @Min(1)
  numberOfQuestions: number;
}

export class QuestionDto {
  @IsString()
  @IsNotEmpty()
  questionText: string;

  @IsIn(['MCQ', 'True/False'])
  type: string;

  @IsOptional()
  @IsArray()
  options?: string[];

  @IsString()
  correctAnswer: string;
}

export class CreateModuleDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @ValidateNested()
  @Type(() => QuizConfigurationDto)
  quizConfiguration: QuizConfigurationDto;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => QuestionDto)
  questionBank: QuestionDto[];

  @IsString()
  @IsIn(['easy', 'medium', 'hard'])
  difficultyLevel: string;
}
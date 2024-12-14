import { IsString, IsOptional, IsArray, IsIn, ValidateNested, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class UpdateQuizConfigurationDto {
  @IsArray()
  @IsOptional()
  @IsIn(['MCQ', 'True/False'], { each: true })
  questionTypes?: string[];

  @IsOptional()
  @Min(1)
  numberOfQuestions?: number;
}

export class UpdateQuestionDto {
  @IsString()
  @IsOptional()
  questionText?: string;

  @IsOptional()
  @IsIn(['MCQ', 'True/False'])
  type?: string;

  @IsOptional()
  @IsArray()
  options?: string[];

  @IsOptional()
  @IsString()
  correctAnswer?: string;
}

export class UpdateModuleDto {
  @IsString()
  @IsOptional()
  title?: string;

  @IsOptional()
  @ValidateNested()
  @Type(() => UpdateQuizConfigurationDto)
  quizConfiguration?: UpdateQuizConfigurationDto;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => UpdateQuestionDto)
  questionBank?: UpdateQuestionDto[];

  @IsOptional()
  @IsString()
  @IsIn(['easy', 'medium', 'hard'])
  difficultyLevel?: string;

  @IsOptional()
  @IsArray()
  resources?: string[];

  @IsOptional()
  content?: {
    url?: string;
    type?: 'pdf' | 'video';
  };

  @IsOptional()
  @IsString()
  @IsIn(['true', 'false'])
  isFlagged?: boolean;
}
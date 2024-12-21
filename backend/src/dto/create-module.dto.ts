import {
  IsString,
  IsArray,
  IsNotEmpty,
  IsIn,
  Min,
  ValidateNested,
  IsOptional,
  IsMongoId,
  ArrayMinSize,
  ArrayNotEmpty,
  IsUrl,
} from 'class-validator';
import { Type } from 'class-transformer';

export class QuizConfigurationDto {
  @IsArray()
  @IsIn(['MCQ', 'True/False'], { each: true, message: 'Question type must be either MCQ or True/False' })
  questionTypes: string[];

  @Min(1, { message: 'Number of questions must be at least 1' })
  numberOfQuestions: number;
}

export class QuestionDto {
  @IsString()
  @IsNotEmpty({ message: 'Question text is required' })
  questionText: string;

  @IsIn(['MCQ', 'True/False'], { message: 'Question type must be either MCQ or True/False' })
  type: string;

  @IsOptional()
  @IsArray()
  @ArrayMinSize(2, { message: 'MCQ must have at least two options' })
  @ArrayNotEmpty({ message: 'Options cannot be empty' })
  options?: string[];

  @IsString()
  @IsNotEmpty({ message: 'Correct answer is required' })
  correctAnswer: string;
}

export class CreateModuleDto {
  @IsMongoId({ message: 'Invalid courseId format' })
  @IsNotEmpty({ message: 'Course ID is required' })
  courseId: string;

  @IsString()
  @IsNotEmpty({ message: 'Title is required' })
  title: string;

  @IsString({ message: 'Content URL must be a valid URL or file path' })
  @IsNotEmpty({ message: 'Content URL is required' })
  contentUrl: string;


  @IsIn(['pdf', 'video'], { message: 'Content type must be either pdf or video' })
  contentType: 'pdf' | 'video';

  @ValidateNested()
  @Type(() => QuizConfigurationDto)
  quizConfiguration: QuizConfigurationDto;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => QuestionDto)
  questionBank: QuestionDto[];

  @IsString()
  @IsIn(['easy', 'medium', 'hard'], { message: 'Difficulty level must be either easy, medium, or hard' })
  difficultyLevel: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true, message: 'Each resource must be a string' })
  resources?: string[];
}

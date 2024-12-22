import { IsString, IsEnum, IsOptional, IsArray, MinLength } from 'class-validator';

export class CreateQuestionDto {
  @IsString()
  questionText: string;

  @IsEnum(['MCQ', 'True/False'], { message: 'Type must be MCQ or True/False' })
  type: 'MCQ' | 'True/False';

  @IsOptional()
  @IsArray()
  @MinLength(2, { each: true, message: 'MCQ must have at least two options.' })
  options?: string[];

  @IsString()
  correctAnswer: string;

  @IsEnum(['easy', 'medium', 'hard'], { message: 'Difficulty level must be easy, medium, or hard' })
  difficultyLevel: 'easy' | 'medium' | 'hard';
}

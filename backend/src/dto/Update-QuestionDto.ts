import { IsString, IsArray, IsOptional, IsEnum, ValidateIf } from 'class-validator';

export class QuestionDto {
  @IsString()
  questionText: string;

  @IsEnum(['MCQ', 'True/False'], {
    message: 'Type must be either "MCQ" or "True/False".',
  })
  type: 'MCQ' | 'True/False';

  @ValidateIf((o) => o.type === 'MCQ') // Only validate options if type is "MCQ"
  @IsOptional()
  @IsArray({ message: 'Options must be an array.' })
  @IsString({ each: true, message: 'Each option must be a string.' })
  options?: string[];

  @IsString()
  correctAnswer: string;

  @IsEnum(['easy', 'medium', 'hard'], {
    message: 'Difficulty level must be "easy", "medium", or "hard".',
  })
  difficultyLevel: 'easy' | 'medium' | 'hard';
}

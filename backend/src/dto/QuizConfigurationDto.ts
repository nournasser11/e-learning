import { IsArray, IsInt, Min, IsEnum } from 'class-validator';

export class QuizConfigurationDto {
  @IsArray()
  @IsEnum(['MCQ', 'True/False'], { each: true })
  questionTypes: string[];

  @IsInt()
  @Min(1)
  numberOfQuestions: number;
}

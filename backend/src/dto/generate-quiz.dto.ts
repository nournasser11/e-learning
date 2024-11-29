import { IsString, IsArray, IsNumber } from 'class-validator';

export class GenerateQuizDto {
  @IsString()
  moduleId: string;

  @IsString()
  userId: string;

  @IsString()
  userPerformance: 'low' | 'average' | 'high';

  @IsNumber()
  questionCount: number;

  @IsArray()
  questionTypes: string[];
}

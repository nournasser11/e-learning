import { IsString, IsEnum, IsNotEmpty, IsArray, ArrayNotEmpty } from 'class-validator';

export class CreateCourseDto {
  
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsEnum(['easy', 'medium', 'hard'])
  @IsNotEmpty()
  difficultyLevel: string;

  @IsString()
  @IsNotEmpty()
  instructor: string;

}

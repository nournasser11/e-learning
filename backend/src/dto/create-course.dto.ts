import { IsString, IsEnum, IsNotEmpty, IsArray, ArrayNotEmpty } from 'class-validator';

export class CreateCourseDto {
  @IsString()
  @IsNotEmpty()
  courseId: string;

  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsString()
  @IsNotEmpty()
  category: string;

  @IsEnum(['easy', 'medium', 'hard'])
  @IsNotEmpty()
  difficultyLevel: string;

  @IsString()
  @IsNotEmpty()
  createdBy: string;

  @IsArray()
  @IsString({ each: true })
  @ArrayNotEmpty()
  assignedUsers: string[];
}

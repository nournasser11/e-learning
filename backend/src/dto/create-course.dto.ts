import { IsString, IsEnum, IsNotEmpty, IsArray, ArrayNotEmpty } from 'class-validator';

export class CreateCourseDto {
  
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsString()
  @IsNotEmpty()
  instructor: string;

}
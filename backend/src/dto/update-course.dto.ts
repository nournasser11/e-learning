import { IsOptional, IsString, IsNotEmpty, IsNumber } from 'class-validator';

export class UpdateCourseDto {
  @IsOptional()
  @IsString()
  @IsNotEmpty({ message: 'Title cannot be empty' })
  title?: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty({ message: 'Description cannot be empty' })
  description?: string;

  @IsOptional()
  @IsNumber()
  version?: number;
}

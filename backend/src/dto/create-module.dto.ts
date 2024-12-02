import { IsString, IsNotEmpty, IsOptional, IsArray, IsUrl } from 'class-validator';

export class CreateModuleDto {
  @IsString()
  @IsNotEmpty()
  moduleId: string;

  @IsString()
  @IsNotEmpty()
  courseId: string;

  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  content: string;

  @IsArray()
  @IsOptional()
  @IsUrl({}, { each: true })
  resources?: string[];
}

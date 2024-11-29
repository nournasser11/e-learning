import { IsString, IsEmail, IsOptional, IsEnum } from 'class-validator';

export class UpdateUserDto {
  @IsString()
  @IsOptional()
  name?: string;

  @IsEmail()
  @IsOptional()
  email?: string;

  @IsString()
  @IsOptional()
  password?: string;

  @IsString()
  @IsOptional()
  profilePictureUrl?: string;

  @IsString()
  @IsEnum(['student', 'instructor', 'admin'])
  @IsOptional()
  role?: string;
}
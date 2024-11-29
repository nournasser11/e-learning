import { IsString, IsEmail, IsNotEmpty, IsEnum, IsOptional } from 'class-validator';

export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  password: string;

  @IsString()
  @IsEnum(['student', 'instructor', 'admin'])
  @IsNotEmpty()
  role: string;

  @IsString()
  @IsOptional()
  profilePictureUrl?: string;
}
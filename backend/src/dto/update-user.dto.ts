import { IsOptional, IsString, MinLength, IsNotEmpty } from 'class-validator';

export class UpdateUserDto {
 

  @IsOptional()
  @IsString()
  @MinLength(6)
  newPassword?: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  currentPassword?: string;

  @IsOptional()
  @IsString()
  role?: string;
}

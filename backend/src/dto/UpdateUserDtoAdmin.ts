import { IsString, IsEmail, IsOptional, IsEnum } from 'class-validator';

export class UpdateUserDtoAdmin {
    
  
    @IsOptional()
    @IsEmail()
    email?: string;
  
    @IsOptional()
    @IsString()
    role?: string;
}

import { PartialType } from '@nestjs/mapped-types';
import { CreateResponseDto } from './create-response.dto'; // Import the base DTO
import { IsOptional, IsString } from 'class-validator';

export class UpdateResponseDto extends PartialType(CreateResponseDto) {
  @IsOptional()
  @IsString()
  content?: string;

  @IsOptional()
  @IsString()
  status?: string; // Marked optional for update flexibility
}

import { IsString, IsOptional, IsNotEmpty } from 'class-validator';

export class UpdateResponseDto {
    @IsOptional()
    @IsString()
    @IsNotEmpty()
    content?: string;

    @IsOptional()
    @IsString()
    @IsNotEmpty()
    status?: string;
}
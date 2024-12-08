import { IsOptional, IsNumber, Min, Max } from 'class-validator';

export class UpdateProgressDto {
    @IsOptional()
    @IsNumber()
    @Min(0)
    @Max(100)
    
    readonly completionPercentage?: number;
  readonly lastAccessed?: Date;
}

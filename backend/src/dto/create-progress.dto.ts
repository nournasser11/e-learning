import { IsNotEmpty, IsNumber, Min, Max } from 'class-validator';

export class CreateProgressDto {
    @IsNotEmpty()
    userId: string;

    @IsNotEmpty()
    courseId: string;

    @IsNumber()
    @Min(0)
    @Max(100)
    completionPercentage: number;
}

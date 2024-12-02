import { IsString, IsNotEmpty, IsDate, IsOptional } from 'class-validator';

export class CreateResponseDto {
  @IsString()
  @IsNotEmpty()
  readonly questionId: string;

  @IsString()
  @IsNotEmpty()
  readonly userId: string;

  @IsString()
  @IsNotEmpty()
  readonly responseText: string;

  @IsDate()
  @IsOptional()
  readonly createdAt?: Date; // Optional

  constructor(questionId: string, userId: string, responseText: string, createdAt?: Date) {
    this.questionId = questionId;
    this.userId = userId;
    this.responseText = responseText;
    this.createdAt = createdAt || new Date(); // Default value if not provided
  }
}

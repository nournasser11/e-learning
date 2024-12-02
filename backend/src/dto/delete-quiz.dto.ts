import { IsNotEmpty, IsUUID } from 'class-validator';

export class DeleteQuizDto {
    @IsNotEmpty()
    @IsUUID()
    id: string;
}
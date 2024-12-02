import { IsNotEmpty, IsString } from 'class-validator';

export class ReadMessageDto {
  @IsNotEmpty({ message: 'Message ID is required' })
  @IsString({ message: 'Message ID must be a string' })
  messageId: string;
}

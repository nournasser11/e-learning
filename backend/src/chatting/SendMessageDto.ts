import { IsNotEmpty, IsString, Length } from 'class-validator';

export class SendMessageDto {
  @IsNotEmpty({ message: 'Sender ID is required' })
  @IsString({ message: 'Sender ID must be a string' })
  senderId: string;

  @IsNotEmpty({ message: 'Receiver ID is required' })
  @IsString({ message: 'Receiver ID must be a string' })
  receiverId: string;

  @IsNotEmpty({ message: 'Content is required' })
  @IsString({ message: 'Content must be a string' })
  @Length(1, 1000, { message: 'Content must be between 1 and 1000 characters' })
  content: string;
}

import { IsString, IsEmail, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import{User} from '../models/user.Schema';
export class CreateUserDto {
  userId: string;
  name: string;
  email: string;
  passwordHash: string;
  role: string;
  profilePictureUrl: string;
}
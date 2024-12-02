import { IsString, IsEnum, IsNotEmpty } from 'class-validator';

export class UpdateRoleDto {
  @IsString()
  @IsEnum(['student', 'instructor', 'admin'])
  @IsNotEmpty()
  role: string;
}

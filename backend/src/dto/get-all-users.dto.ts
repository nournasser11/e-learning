import { IsOptional, IsString } from 'class-validator';

export class GetUsersQueryDto {
  @IsOptional()
  @IsString()
  role?: string;

  @IsOptional()
  @IsString()
  status?: string;
}

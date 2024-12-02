import { Controller, Post, Get, Put, Delete, Param, Body } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from '../dto/create-user.dto';
import { UpdateUserDto } from '../dto/update-user.dto';
import { LoginUserDto } from '../dto/login-user.dto';
import { User } from '../models/user.schema';
import { UserResponseDto } from '../dto/user-response.dto';
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  async create(@Body() createUserDto: CreateUserDto): Promise<UserResponseDto> {
    const user = await this.usersService.create(createUserDto);
    return { id: user._id as string, email: user.email, role: user.role };
  }

  @Get()
  async findAll(): Promise<UserResponseDto[]> {
    const users = await this.usersService.findAll();
    return users.map(user => ({
      id: user._id as string,
      email: user.email,
      role: user.role,
    }));
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<UserResponseDto> {
    const user = await this.usersService.findOne(id);
    return { id: user._id as string, email: user.email, role: user.role };
  }

  @Get(':id/profile')
  async getProfile(@Param('id') id: string): Promise<UserResponseDto> {
    const user = await this.usersService.getProfile(id);
    return { id: user._id as string, email: user.email, role: user.role };
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<UserResponseDto> {
    const user = await this.usersService.update(id, updateUserDto);
    return { id: user._id as string, email: user.email, role: user.role };
  }

  @Delete(':id')
  async remove(@Param('id') id: string): Promise<UserResponseDto> {
    const user = await this.usersService.remove(id);
    return { id: user._id as string, email: user.email, role: user.role };
  }
}
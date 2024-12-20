import { Controller, Post, Get, Body, Param, UseGuards, HttpException, HttpStatus, } from '@nestjs/common';
import { UsersService } from './users.service';
import { RegisterUserDto } from '../dto/register-user.dto';
import { LoginUserDto } from '../dto/login-user.dto';
import { UpdateUserDto } from '../dto/update-user.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { User } from '../models/user.schema';

@Controller('users')
export class UserController {
  constructor(private readonly usersService: UsersService) { }

  // Register a new user
  @Post('register')
  async register(@Body() registerUserDto: RegisterUserDto) {
    try {
      const user = await this.usersService.create(registerUserDto);
      return { message: 'User registered successfully', user };
    } catch (error) {
      throw new HttpException(
        (error as any).message || 'Error registering user',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  // Login user
  @Post('login')
  async login(@Body() loginUserDto: LoginUserDto) {
    const { email, password } = loginUserDto;
    const { accessToken, role, _id, name } = await this.usersService.login(email, password);

    return {
      message: 'Login successful',
      accessToken,
      role,
      _id,
      name,
    };
  }

  // Get all students NEW
  @Get('students')
  async getAllStudents(): Promise<User[]> {
    try {
      return await this.usersService.findStudents();
    } catch (error) {
      throw new HttpException(
        `Failed to fetch students: ${(error as any).message}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  // Get all instructors NEW
  @Get('instructors')
  async getAllInstructors(): Promise<User[]> {
    try {
      return await this.usersService.findInstructors();
    } catch (error) {
      throw new HttpException(
        `Failed to fetch instructors: ${(error as any).message}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  // Get user profile by ID
  @Get('profile/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  async getProfile(@Param('id') id: string) {
    try {
      const user = await this.usersService.findOne(id);
      if (!user) {
        throw new HttpException('User not found', HttpStatus.NOT_FOUND);
      }
      return user;
    } catch (error) {
      throw new HttpException(
        (error as any).message || 'Error fetching profile',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  // Update user profile
  @Post('update/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin', 'instructor') // Only admins and instructors can update profiles
  async updateProfile(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    try {
      const updatedUser = await this.usersService.update(id, updateUserDto);
      return { message: 'Profile updated successfully', updatedUser };
    } catch (error) {
      throw new HttpException(
        (error as any).message || 'Error updating profile',
        HttpStatus.BAD_REQUEST,
      );
    }
  }
}
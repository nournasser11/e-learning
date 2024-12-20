import { Controller, Post, Get, Body, Param,Query, UseGuards, HttpException, HttpStatus } from '@nestjs/common';
import {
  Controller,
  Post,
  Put,
  Get,
  Body,
  Delete,
  Param,
  UseGuards,
  HttpException,
  HttpStatus,
  UploadedFile,
  UseInterceptors,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { RegisterUserDto } from '../dto/register-user.dto';
import { LoginUserDto } from '../dto/login-user.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';

@Controller('users')
export class UserController {
  constructor(private readonly usersService: UsersService) {}

  /**
   * Register a new user
   */
  @Post('register')
  @UseInterceptors(
    FileInterceptor('profilePicture', {
      storage: diskStorage({
        destination: './uploads/profile-pictures',
        filename: (req, file, cb) => {
          const uniqueName = `${Date.now()}-${file.originalname}`;
          cb(null, uniqueName);
        },
      }),
      fileFilter: (req, file, cb) => {
        if (file.mimetype.startsWith('image/')) {
          cb(null, true);
        } else {
          cb(new BadRequestException('Only image files are allowed!'), false);
        }
      },
      limits: { fileSize: 2 * 1024 * 1024 }, // Limit file size to 2MB
    }),
  )
  async register(
    @Body() registerUserDto: RegisterUserDto,
    @UploadedFile() profilePicture: Express.Multer.File,
  ) {
    try {
      // Set profile picture URL if a file was uploaded
      const profilePictureUrl = profilePicture
        ? `/uploads/profile-pictures/${profilePicture.filename}`
        : null;
  
      // Pass the updated DTO to the service
      const user = await this.usersService.create({
        ...registerUserDto,
        profilePictureUrl,
      });
  
      return { message: 'User registered successfully', user };
    } catch (error) {
      throw new HttpException(
        (error as any).message || 'Registration failed',
        HttpStatus.BAD_REQUEST,
      );
    }
  }
  @Post('login')
  async login(@Body() loginUserDto: LoginUserDto) {
    try {
      const { email, password } = loginUserDto;

      if (!email || !password) {
        throw new HttpException(
          'Email and password are required',
          HttpStatus.BAD_REQUEST,
        );
      }

      const result = await this.usersService.login(email, password);

      return {
        message: 'Login successful',
        accessToken: result.accessToken,
        role: result.role,
        _id: result._id,
        name: result.name,
        profilePicture: result.profilePicture || null,
      };
    } catch (error) {
      console.error('Login error:', (error as any).message);

      throw new HttpException(
        (error as any).message || 'Invalid credentials',
        HttpStatus.UNAUTHORIZED,
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

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
  Query,
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

  /**
   * Login a user
   */
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

  /**
   * Update profile picture
   */
  @Post(':id/upload-profile-picture')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(
    FileInterceptor('file', {
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
    }),
  )
  async uploadProfilePicture(
    @Param('id') id: string,
    @UploadedFile() file: Express.Multer.File,
  ) {
    if (!file) {
      throw new BadRequestException('No file uploaded');
    }

    const profilePictureUrl = `/uploads/profile-pictures/${file.filename}`;
    console.log('Profile Picture URL:', profilePictureUrl); // Debug log
    await this.usersService.updateProfilePicture(id, profilePictureUrl);

    return { message: 'Profile picture updated successfully', profilePictureUrl };
  }

  /**
   * Search for instructors by name
   */
  @Get('search-instructors')
  async searchInstructors(@Query('name') name: string) {
    return this.usersService.searchInstructorsByName(name);
  }

  /**
   * Update user password
   */
  @Put(':id/update-password')
  async updatePassword(
    @Param('id') id: string,
    @Body() body: { currentPassword: string; newPassword: string },
  ) {
    const { currentPassword, newPassword } = body;

    if (!currentPassword || !newPassword) {
      throw new BadRequestException(
        'Both current and new passwords are required.',
      );
    }

    const result = await this.usersService.updatePassword(
      id,
      currentPassword,
      newPassword,
    );

    if (!result) {
      throw new HttpException('Password update failed.', HttpStatus.BAD_REQUEST);
    }

    return { message: 'Password updated successfully' };
  }

  /**
   * Delete user account
   */
  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  async deleteUser(@Param('id') id: string) {
    const result = await this.usersService.deleteUser(id);
    if (!result) {
      throw new NotFoundException('User not found');
    }
    return { message: 'User deleted successfully' };
  }

  /**
   * Get user profile
   */
  @Get(':id')
  @UseGuards(JwtAuthGuard)
  async getUserProfile(@Param('id') id: string) {
    try {
      const user = await this.usersService.findOne(id);
      if (!user) {
        throw new NotFoundException('User not found');
      }
  
      return {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        profilePicture: user.profilePicture, // Ensure this is returned
      };
    } catch (error) {
      throw new HttpException(
        (error as any).message || 'Error fetching user profile',
        HttpStatus.BAD_REQUEST,
      );
    }
  }
  

  /**
   * Update user information
   */
  @Put(':id')
  async updateUser(@Param('id') id: string, @Body() updateData: { name?: string }) {
    if (!updateData.name) {
      throw new HttpException('Name field is required', HttpStatus.BAD_REQUEST);
    }

    const updatedUser = await this.usersService.updateUser(id, updateData);
    if (!updatedUser) {
      throw new NotFoundException('User not found');
    }

    return { message: 'Name updated successfully', user: updatedUser };
  }
}

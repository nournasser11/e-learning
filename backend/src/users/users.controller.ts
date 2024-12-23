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
import {AuthService} from '../auth/auth.service';
import * as bcrypt from 'bcrypt';

@Controller('users')
export class UserController {
  constructor(private readonly usersService: UsersService) {}
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



 
  @Post('login')
  async login(@Body() loginUserDto: LoginUserDto) {
    const { email, password } = loginUserDto;
    const { accessToken, role, _id, name } = await this.usersService.login(email, password);
    
    return {
      message: 'Login successful',
      accessToken,
      role, // Include the role in the response
      _id,  // Include the _id in the response
      name, // Include the name in the response
    };
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

import { Controller, Post, Body, HttpException, HttpStatus, Get, Delete, Param, Patch } from '@nestjs/common';
import { AdminService } from './admin.service';
import { CreateAdminDto } from '../dto/create-admin.dto';
import { User } from '../models/user.schema';
import { UpdateUserDto } from '../dto/update-user.dto';
import { UpdateUserDtoAdmin } from '../dto/UpdateUserDtoAdmin'


@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Post()
  async create(@Body() createAdminDto: CreateAdminDto): Promise<User> {
    try {
      return await this.adminService.create(createAdminDto);
    } catch (error) {
      throw new HttpException(
        error.message || 'Internal Server Error',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  @Get('users')
  async getAllUsers(): Promise<User[]> {
    try {
      return await this.adminService.findAllUsers();
    } catch (error) {
      throw new HttpException(error.message || 'Internal Server Error', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
  @Get('student')  // This defines the endpoint /admin/students
  async getAllStudents(): Promise<User[]> {
  try {
    return await this.adminService.findUsersByRole('student');
  } catch (error) {
    throw new HttpException(error.message || 'Internal Server Error', HttpStatus.INTERNAL_SERVER_ERROR);
  }
  }
  // if it's emty make a message that no instructor was founded
  @Get('instructors')  // This defines the endpoint /admin/instructors
  async getAllInstructors(): Promise<User[]> {
    try {
      return await this.adminService.findUsersByRole('instructor');
    } catch (error) {
      throw new HttpException(error.message || 'Internal Server Error', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Get('admins')  // This defines the endpoint /admin/admins
  async getAllAdmins(): Promise<User[]> {
    try {
      return await this.adminService.findUsersByRole('admin');
    } catch (error) {
      throw new HttpException(error.message || 'Internal Server Error', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Delete(':id')
async deleteUser(@Param('id') id: string): Promise<{ message: string }> {
  try {
    await this.adminService.deleteUserById(id);
    return { message: 'User deleted successfully' };
  } catch (error) {
    if (error.message === 'Invalid ID format') {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    } else if (error.message === 'User not found') {
      throw new HttpException(error.message, HttpStatus.NOT_FOUND);
    } else {
      throw new HttpException(error.message || 'Internal Server Error', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}

@Patch(':id')  // Defines the endpoint /admin/:id for updating a user by ID
  async updateUser(
    @Param('id') id: string,
    @Body() updateUserDtoAdmin: UpdateUserDtoAdmin,
  ): Promise<{ message: string; updatedUser: User }> {
    try {
      // Call the update method in the service
      const updatedUser = await this.adminService.updateById(id, updateUserDtoAdmin);

      return { message: 'User updated successfully', updatedUser };
    } catch (error) {
      // Handle different error types based on the error message
      if (error.message === 'Invalid ID format') {
        throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
      } else if (error.message === 'User not found') {
        throw new HttpException(error.message, HttpStatus.NOT_FOUND);
      } else {
        // Default error handler
        throw new HttpException(error.message || 'Internal Server Error', HttpStatus.INTERNAL_SERVER_ERROR);
      }
    }
  }

}

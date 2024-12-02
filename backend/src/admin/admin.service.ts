import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { isValidObjectId, Model } from 'mongoose';
import { User, UserDocument } from '../models/user.schema';
import * as bcrypt from 'bcrypt';
import { CreateAdminDto } from '../dto/create-admin.dto';
import { UpdateUserDto } from '../dto/update-user.dto';
import { UpdateUserDtoAdmin } from '../dto/UpdateUserDtoAdmin';


@Injectable()
export class AdminService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async create(createAdminDto: CreateAdminDto): Promise<User> {
    const { name, email, password } = createAdminDto;

    // Check if the email is already in use
    const existingUser = await this.userModel.findOne({ email }).exec();
    if (existingUser) {
      throw new Error('User with this email already exists');
    }

    // Hash the password
    const passwordHash = await bcrypt.hash(password, 10);

    // Create a new admin user
    const newAdmin = new this.userModel({
      name,
      email,
      passwordHash,
      role: 'admin', // Explicitly set role to 'admin'
      profilePictureUrl: '', // Default or empty value
    });

    return newAdmin.save();
  }

  async findAllUsers(): Promise<User[]> {
    return this.userModel.find().exec();
  }

  async findUsersByRole(role: string): Promise<User[]> {
    try {
      return await this.userModel.find({ role }).exec(); // Finds all users with the specified role
    } catch (error) {
      throw new Error(`Error while fetching users by role: ${error.message}`);
    }
  }

  async deleteUserById(id: string): Promise<void> {
    if (!isValidObjectId(id)) {
      throw new Error('Invalid ID format');
    }
  
    try {
      const result = await this.userModel.deleteOne({ _id: id }).exec();
      if (result.deletedCount === 0) {
        throw new Error('User not found');
      }
    } catch (error) {
      throw new Error(`Failed to delete user: ${error.message}`);
    }
  }

  

  async updateById(id: string, updateUserDtoAdmin: UpdateUserDtoAdmin): Promise<any> {
    const user = await this.userModel.findById(id).exec();
    if (!user) {
      throw new NotFoundException('User not found');
    }

    // Validate role
    if (updateUserDtoAdmin.role && !['admin', 'student', 'instructor'].includes(updateUserDtoAdmin.role)) {
      throw new Error('Invalid role value');
    }

    // Update the fields that are provided in the DTO
    
    if (updateUserDtoAdmin.email) user.email = updateUserDtoAdmin.email;
    if (updateUserDtoAdmin.role) user.role = updateUserDtoAdmin.role;

    // Save the updated user
    const updatedUser = await user.save();

    // Return the updated user document
    return {
      message: 'User updated successfully',
      updatedUser,
    };
  }
  
  
}

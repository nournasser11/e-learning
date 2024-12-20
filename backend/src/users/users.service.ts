import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from '../models/user.schema';
import { RegisterUserDto } from '../dto/register-user.dto';
import { UpdateUserDto } from '../dto/update-user.dto';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class UsersService {
  private readonly logger = new Logger(UsersService.name);

  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    private jwtService: JwtService,
  ) { }

  // Create a new user
  async create(createUserDto: RegisterUserDto): Promise<User> {
    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);

    // Ensure unique email (validation before creating the user)
    const existingUser = await this.userModel.findOne({ email: createUserDto.email });
    if (existingUser) {
      throw new UnauthorizedException('Email is already registered');
    }

    const newUser = new this.userModel({
      ...createUserDto,
      passwordHash: hashedPassword,
      role: createUserDto.role || 'student', // Default to 'student'
    });

    const savedUser = await newUser.save();
    this.logger.log(`User created with ID: ${savedUser._id}`);
    return savedUser;
  }

  // Fetch all users
  async findAll(): Promise<User[]> {
    this.logger.log('Retrieving all users...');
    return this.userModel.find().exec();
  }

  // Fetch users with role "student" NEW
  async findStudents(): Promise<User[]> {
    this.logger.log('Fetching all students...');
    return this.userModel.find({ role: 'student' }).exec();
  }

  // Fetch users with role "instructor" NEW
  async findInstructors(): Promise<User[]> {
    this.logger.log('Fetching all instructors...');
    return this.userModel.find({ role: 'instructor' }).exec();
  }

  // Get user by ID
  async findOne(id: string): Promise<User> {
    const user = await this.userModel.findById(id).exec();
    if (!user) {
      throw new UnauthorizedException('User not found');
    }
    return user;
  }

  // Update user info
  async update(id: string, updateUserDto: UpdateUserDto): Promise<User> {
    const user = await this.userModel.findById(id).exec();
    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    // Update password if provided
    if (updateUserDto.newPassword && updateUserDto.currentPassword) {
      const isPasswordValid = await bcrypt.compare(updateUserDto.currentPassword, user.passwordHash);
      if (!isPasswordValid) {
        throw new UnauthorizedException('Current password is incorrect');
      }

      const hashedNewPassword = await bcrypt.hash(updateUserDto.newPassword, 10);
      user.passwordHash = hashedNewPassword;
    }

    // Update other fields if provided
    if (updateUserDto.name) user.name = updateUserDto.name;
    if (updateUserDto.email) user.email = updateUserDto.email;

    // Save and return updated user
    const updatedUser = await user.save();
    this.logger.log(`User updated with ID: ${id}`);
    return updatedUser;
  }

  // Delete a user
  async remove(id: string): Promise<User> {
    const user = await this.userModel.findByIdAndDelete(id).exec();
    if (!user) {
      throw new UnauthorizedException('User not found');
    }
    this.logger.log(`User deleted with ID: ${id}`);
    return user;
  }

  // Login
  async login(email: string, password: string) {
    const user = await this.userModel.findOne({ email });
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const accessToken = this.jwtService.sign({ email, sub: user._id });

    return {
      accessToken,
      role: user.role,
      _id: user._id,
      name: user.name,
    };
  }
}
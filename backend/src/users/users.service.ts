import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from '../models/user.schema';
import { RegisterUserDto } from '../dto/register-user.dto';
import { UpdateUserDto } from '../dto/update-user.dto';
import { LoginUserDto } from '../dto/login-user.dto';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from '../auth/jwt-payload.interface';

@Injectable()
export class UsersService {
  private readonly logger = new Logger(UsersService.name);

  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    private jwtService: JwtService,
  ) {}

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

  // Get all users (Admin role only)
  async findAll(): Promise<User[]> {
    this.logger.log('Retrieving all users...');
    return this.userModel.find().exec();
  }

  // Get user by ID (for profile access)
  async findOne(id: string): Promise<User> {
    const user = await this.userModel.findById(id).exec();
    if (!user) {
      throw new UnauthorizedException('User not found');
    }
    return user;
  }

  // Update user info (supports password updates and other fields)
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

  // Delete a user (Admin role only)
  async remove(id: string): Promise<User> {
    const user = await this.userModel.findByIdAndDelete(id).exec();
    if (!user) {
      throw new UnauthorizedException('User not found');
    }
    this.logger.log(`User deleted with ID: ${id}`);
    return user;
  }

  // Login (Generate JWT token)
  async login(email: string, password: string): Promise<{ accessToken: string; role: string }> {
    const user = await this.userModel.findOne({ email }).exec();

    if (!user || !(await bcrypt.compare(password, user.passwordHash))) {
      this.logger.error(`Failed login attempt for email: ${email}`);
      throw new UnauthorizedException('Invalid credentials');
    }

    // Role is determined from the database
    const payload: JwtPayload = { email: user.email, sub: user._id.toString(), role: user.role };
    const accessToken = this.jwtService.sign(payload, { expiresIn: '1h' });

    this.logger.log(`User logged in with email: ${email} and role: ${user.role}`);
    return { accessToken, role: user.role }; // Include role in the response
  }

  // Validate user credentials (for guards or strategies)
  async validateUser(email: string, password: string, role?: string): Promise<User | null> {
    const user = await this.userModel.findOne({ email }).exec();
    if (user && (await bcrypt.compare(password, user.passwordHash))) {
      // Optional: Validate role if provided
      if (role && user.role !== role) {
        return null; // Role doesn't match
      }
      return user; // Return user if email, password, and role are valid
    }
    return null; // Return null if validation fails
  }
}
  

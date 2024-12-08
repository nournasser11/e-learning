import { Injectable, Logger, UnauthorizedException, ForbiddenException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from '../models/user.schema';
import { CreateUserDto } from '../dto/create-user.dto';
import { UpdateUserDto } from '../dto/update-user.dto';
import { LoginUserDto } from '../dto/login-user.dto';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from '../auth/jwt-payload.interface'; // You may need to create this

@Injectable()
export class UsersService {
  private readonly logger = new Logger(UsersService.name);

  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    private jwtService: JwtService,
  ) {}

  // Create a new user
  async create(createUserDto: CreateUserDto): Promise<User> {
    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);
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
    return this.userModel.find().exec();
  }

  // Get user by ID (for profile access)
  async findOne(id: string): Promise<User> {
    return this.userModel.findById(id).exec();
  }

  // Update user info
  async update(id: string, updateUserDto: UpdateUserDto): Promise<User> {
    const isPasswordValid = await bcrypt.compare(updateUserDto.currentPassword, updateUserDto.newPassword);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Old password is incorrect');
    }
    if (updateUserDto.currentPassword) {
      updateUserDto.newPassword = await bcrypt.hash(updateUserDto.newPassword, 10);
    }
    return this.userModel.findByIdAndUpdate(id, updateUserDto, { new: true }).exec();
  }

  // Delete a user (Admin role only)
  async remove(id: string): Promise<User> {
    return this.userModel.findByIdAndDelete(id).exec();
  }

  // Login (Generate JWT token)
  async login(loginUserDto: LoginUserDto): Promise<{ accessToken: string }> {
    const { email, password } = loginUserDto;
    const user = await this.userModel.findOne({ email }).exec();

    if (!user || !(await bcrypt.compare(password, user.passwordHash))) {
      this.logger.warn(`Failed login attempt for email: ${email}`)
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload: JwtPayload = { email: user.email, sub: user._id.toString(), role: user.role };
    const accessToken = this.jwtService.sign(payload, { expiresIn: '1h' }); // Token expires in 1 hour

    return { accessToken };
  }

  // Get user profile by ID (Authenticated users only)
  async getProfile(id: string): Promise<User> {
    return this.userModel.findById(id).exec();
  }

  // Validate if the user has the required role
  async hasRole(userId: string, requiredRole: string): Promise<boolean> {
    const user = await this.userModel.findById(userId).exec();
    if (!user) {
      throw new UnauthorizedException('User not found');
    }
    return user.role === requiredRole;
  }

  // Check if the current user is an Admin (for RBAC purposes)
  async isAdmin(userId: string): Promise<boolean> {
    const user = await this.userModel.findById(userId).exec();
    if (!user) {
      throw new UnauthorizedException('User not found');
    }
    return user.role === 'admin';
  }
}

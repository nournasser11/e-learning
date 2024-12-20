import {
  Injectable,
  Logger,
  UnauthorizedException,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
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
  ) {}

  // Create a new user
  async create(registerUserDto: RegisterUserDto): Promise<User> {
    const { email, password, profilePictureUrl } = registerUserDto;

    const existingUser = await this.userModel.findOne({ email });
    if (existingUser) {
      throw new BadRequestException('Email is already registered');
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new this.userModel({
      ...registerUserDto,
      passwordHash: hashedPassword,
      profilePicture: profilePictureUrl || '',
      role: registerUserDto.role || 'student',
    });

    return await newUser.save();
  }

  // Find all users
  async findAll(): Promise<User[]> {
    return this.userModel.find().exec();
  }

  // Find a user by ID
  async findOne(id: string): Promise<User> {
    const user = await this.userModel.findById(id).exec();
    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  // Update user name or other fields
  async updateUser(id: string, updateData: { name?: string }): Promise<User> {
    const user = await this.userModel.findById(id).exec();
    if (!user) throw new NotFoundException('User not found');

    if (updateData.name) user.name = updateData.name;

    await user.save();
    return user;
  }

  // Update user password
  async updatePassword(
    userId: string,
    currentPassword: string,
    newPassword: string,
  ): Promise<boolean> {
    const user = await this.userModel.findById(userId);
    if (!user) throw new NotFoundException('User not found');

    const isPasswordValid = await bcrypt.compare(currentPassword, user.passwordHash);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Current password is incorrect');
    }

    user.passwordHash = await bcrypt.hash(newPassword, 10);
    await user.save();

    return true;
  }

  // Update user profile picture
  async updateProfilePicture(userId: string, profilePictureUrl: string): Promise<User> {
    const user = await this.userModel.findById(userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }
  
    user.profilePicture = profilePictureUrl; // Update profile picture field
    await user.save(); // Ensure it is saved in the database
  
    return user;
  }
  

  // Delete a user
  async deleteUser(id: string): Promise<boolean> {
    const result = await this.userModel.deleteOne({ _id: id }).exec();
    return result.deletedCount > 0;
  }

  // Login (JWT Generation)
  async login(email: string, password: string) {
    const user = await this.userModel.findOne({ email });
    if (!user) throw new UnauthorizedException('Invalid credentials');

    const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
    if (!isPasswordValid) throw new UnauthorizedException('Invalid credentials');

    const accessToken = this.jwtService.sign({ email, sub: user._id });

    return {
      accessToken,
      role: user.role,
      _id: user._id,
      name: user.name,
      profilePicture: user.profilePicture,
    };
  }

  // Validate user for JWT Guards
  async validateUser(email: string, password: string): Promise<User | null> {
    const user = await this.userModel.findOne({ email }).exec();
    if (user && (await bcrypt.compare(password, user.passwordHash))) {
      return user;
    }
    return null;
  }

  async searchInstructorsByName(name: string): Promise<User[]> {
    // If name is empty or undefined, you might return an empty array or all instructors
    if (!name) return [];
  
    // Role must be 'instructor', and name partially matches (case-insensitive)
    return this.userModel.find({
      role: 'instructor',
      name: { $regex: name, $options: 'i' },
    }).exec();
  }
  
}

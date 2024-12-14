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
  ) { }

  // Create a new user
  async create(createUserDto: RegisterUserDto): Promise<User> {
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

  // Update user info, particularly password
  async update(id: string, updateUserDto: UpdateUserDto): Promise<User> {
    if (updateUserDto.newPassword && updateUserDto.currentPassword) {
      const user = await this.userModel.findById(id).exec();
      if (!user) {
        throw new UnauthorizedException('User not found');
      }

      const isPasswordValid = await bcrypt.compare(updateUserDto.currentPassword, user.passwordHash);
      if (!isPasswordValid) {
        throw new UnauthorizedException('Current password is incorrect');
      }

      const hashedNewPassword = await bcrypt.hash(updateUserDto.newPassword, 10);
      user.passwordHash = hashedNewPassword;
      return user.save();
    }

    // Update other fields as necessary
    return this.userModel.findByIdAndUpdate(id, {
      name: updateUserDto.name,
      email: updateUserDto.email,
      // Other fields can be updated here
    }, { new: true }).exec();
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
      this.logger.error(`Failed login attempt for email: ${email}`);
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload: JwtPayload = { email: user.email, sub: user._id.toString(), role: user.role };
    const accessToken = this.jwtService.sign(payload, { expiresIn: '1h' }); // Token expires in 1 hour

    return { accessToken };
  }

  // Validate user credentials
  async validateUser(email: string, password: string): Promise<User | null> {
    const user = await this.userModel.findOne({ email }).exec();
    if (user && await bcrypt.compare(password, user.passwordHash)) {
      return user;
    }
    return null;
  }
}
import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from '../models/user.schema';
import { CreateUserDto } from '../dto/create-user.dto';
import { UpdateUserDto } from '../dto/update-user.dto';
import { LoginUserDto } from '../dto/login-user.dto';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class UsersService {
  private readonly logger = new Logger(UsersService.name);

  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    private jwtService: JwtService,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);
    const newUser = new this.userModel({
      ...createUserDto,
      passwordHash: hashedPassword,
      role: createUserDto.role === 'instructor' ? 'instructor' : 'student',
    });
    const savedUser = await newUser.save();
    this.logger.log(`User created with ID: ${savedUser._id}`);
    return savedUser;
  }

  async findAll(): Promise<User[]> {
    return this.userModel.find().exec();
  }

  async findOne(id: string): Promise<User> {
    return this.userModel.findById(id).exec();
  }

  async update(id: string, updateUserDto: UpdateUserDto): Promise<User> {
    if (updateUserDto.password) {
      updateUserDto.password = await bcrypt.hash(updateUserDto.password, 10);
    }
    return this.userModel.findByIdAndUpdate(id, updateUserDto, { new: true }).exec();
  }

  async remove(id: string): Promise<User> {
    return this.userModel.findByIdAndDelete(id).exec();
  }

  async login(loginUserDto: LoginUserDto): Promise<{ accessToken: string; user: Partial<User> }> {
    const { email, password } = loginUserDto;
    const user = await this.userModel.findOne({ email }).exec();
  
    if (!user || !(await bcrypt.compare(password, user.passwordHash))) {
      throw new UnauthorizedException('Invalid credentials');
    }
  
    const payload = { email: user.email, sub: user._id };
    const accessToken = this.jwtService.sign(payload);
  
    return {
      accessToken,
      user: {
        id: user._id,
        email: user.email,
        role: user.role,
      },
    };
  }
  

  async getProfile(id: string): Promise<User> {
    return this.userModel.findById(id).exec();
  }
}
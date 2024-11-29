import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from '../models/user.schema';
import { CreateUserDto } from '../dto/create-user.dto';
import { UpdateUserDto } from '../dto/update-user.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  private readonly logger = new Logger(UsersService.name);

  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  // Create a new user
  async create(createUserDto: CreateUserDto): Promise<User> {
    this.logger.log('Creating a new user');
    // Hash the password before saving it
    const hashedPassword = await bcrypt.hash(createUserDto.password, 10); // 10 rounds for hashing

    // Create the user
    const newUser = new this.userModel({
      ...createUserDto,
      passwordHash: hashedPassword, // Save the hashed password
    });
    const savedUser = await newUser.save();
    this.logger.log(`User created with ID: ${savedUser._id}`);
    return savedUser;
  }

  // Retrieve all users
  async findAll(): Promise<User[]> {
    return this.userModel.find().exec();
  }

  // Retrieve a user by ID
  async findOne(id: string): Promise<User> {
    return this.userModel.findById(id).exec();
  }

  // Update a user
  async update(id: string, updateUserDto: UpdateUserDto): Promise<User> {
    if (updateUserDto.password) {
      const hashedPassword = await bcrypt.hash(updateUserDto.password, 10);
      updateUserDto = { ...updateUserDto, password: hashedPassword };
    }
    return this.userModel.findByIdAndUpdate(id, updateUserDto, { new: true }).exec();
  }

  // Delete a user
  async remove(id: string): Promise<User> {
    return this.userModel.findByIdAndDelete(id).exec();
  }
}
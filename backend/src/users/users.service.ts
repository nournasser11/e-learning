import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from '../models/user.schema';
import { CreateUserDto } from '../dto/create-user.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  private readonly logger = new Logger(UsersService.name);

  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  // Create a new user
  async create(createUserDto: CreateUserDto): Promise<User> {
    this.logger.log('Creating a new user');
    
    // If the password is not provided, return an error
    if (!createUserDto.password) {
      throw new Error('Password is required');
    }

    // Hash the password before saving it
    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);  // Hash the 'password' field

    // Create the user with the hashed password
    const newUser = new this.userModel({
      ...createUserDto,
      passwordHash: hashedPassword,  // Save the hashed password in 'passwordHash' field
    });

    // Save the user to the database
    const savedUser = await newUser.save();
    this.logger.log('User created with ID: ${savedUser._id}');
    
    return savedUser; // Return the saved user
  }

  // Retrieve all users
  async findAll(): Promise<User[]> {
    return this.userModel.find().exec();
  }

  // Retrieve a user by ID
  async findOne(id: string): Promise<User> {
    const user = await this.userModel.findById(id).exec();
    if (!user) {
      throw new Error('User with ID ${id} not found');
    }
    return user;
  }

  // Update a user by ID
  async update(id: string, updateUserDto: Partial<CreateUserDto>): Promise<User> {
    const updatedUser = await this.userModel
      .findByIdAndUpdate(id, updateUserDto, { new: true })
      .exec();
    if (!updatedUser) {
      throw new Error('User with ID ${id} not found');
    }
    return updatedUser;
  }

  // Delete a user by ID
  async remove(id: string): Promise<User> {
    const deletedUser = await this.userModel.findByIdAndDelete(id).exec();
    if (!deletedUser) {
      throw new Error('User with ID ${id} not found');
    }
    return deletedUser;
  }
}

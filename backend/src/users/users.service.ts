<<<<<<< HEAD
import { Injectable, Logger } from '@nestjs/common';
=======
import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
>>>>>>> 87c5d822a8e325460df59e577fc2ddd767b10d29
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

<<<<<<< HEAD
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}
=======
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    private jwtService: JwtService,
  ) {}
>>>>>>> 87c5d822a8e325460df59e577fc2ddd767b10d29

  async create(createUserDto: CreateUserDto): Promise<User> {
<<<<<<< HEAD
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
=======
    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);
    const newUser = new this.userModel({
      ...createUserDto,
      passwordHash: hashedPassword,
      role: createUserDto.role === 'instructor' ? 'instructor' : 'student',
    });
    const savedUser = await newUser.save();
    this.logger.log(`User created with ID: ${savedUser._id}`);
    return savedUser;
>>>>>>> 87c5d822a8e325460df59e577fc2ddd767b10d29
  }

  async findAll(): Promise<User[]> {
    return this.userModel.find().exec();
  }

  async findOne(id: string): Promise<User> {
<<<<<<< HEAD
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
=======
    return this.userModel.findById(id).exec();
  }

  async update(id: string, updateUserDto: UpdateUserDto): Promise<User> {
    if (updateUserDto.password) {
      updateUserDto.password = await bcrypt.hash(updateUserDto.password, 10);
>>>>>>> 87c5d822a8e325460df59e577fc2ddd767b10d29
    }
    return this.userModel.findByIdAndUpdate(id, updateUserDto, { new: true }).exec();
  }

  async remove(id: string): Promise<User> {
<<<<<<< HEAD
    const deletedUser = await this.userModel.findByIdAndDelete(id).exec();
    if (!deletedUser) {
      throw new Error('User with ID ${id} not found');
    }
    return deletedUser;
  }
}
=======
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
>>>>>>> 87c5d822a8e325460df59e577fc2ddd767b10d29

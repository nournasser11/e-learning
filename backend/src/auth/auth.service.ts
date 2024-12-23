import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from '../models/user.Schema';
import { LoginUserDto } from '../dto/login-user.dto';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    private jwtService: JwtService,
  ) {}

  async login(loginDto: LoginUserDto): Promise<{ accessToken: string, role: string, userId: string, name: string, profilePicture: string }> {
    const { email, password } = loginDto;
    const user = await this.userModel.findOne({ email }).exec();

    if (!user || !(await bcrypt.compare(password, user.passwordHash))) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload = { email: user.email, sub: user._id };
    const accessToken = this.jwtService.sign(payload);

    return {
      accessToken,
      role: user.role,
      userId: user.userId,
      name: user.name,
      profilePicture: user.profilePicture,
    };
  }
}

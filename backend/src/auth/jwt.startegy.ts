import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { JwtPayload } from './jwt-payload.interface'; // Ensure you have this interface defined
import { UsersService } from '../users/users.service'; // Ensure you have the UsersService imported
import { UnauthorizedException } from '@nestjs/common';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly usersService: UsersService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET || '12', // Make sure to use the same secret as in JwtModule
    });
  }

  async validate(payload: JwtPayload) {
    const user = await this.usersService.findOne(payload.sub); // Use payload.sub as the user ID
    if (!user) {
      throw new UnauthorizedException('User not found');
    }
    console.log('Validated User:', user);
    return { ...user.toObject(), role: user.role }; // Attach user data and role
  }
}

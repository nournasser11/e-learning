import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { User, UserSchema } from '../models/user.schema';
import { JwtStrategy } from '../auth/jwt.startegy'; // Create the JWT strategy
import { JwtAuthGuard } from '../auth/jwt-auth.guard'; // Ensure this is imported
import { RolesGuard } from '../auth/roles.guard'; // Ensure this is imported

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    PassportModule, // Required for Passport-based guards
    JwtModule.register({
      secret: process.env.JWT_SECRET || '12', // Replace with your secret key
      signOptions: { expiresIn: '1h' }, // Set default expiration time for tokens
    }),
  ],
  controllers: [UsersController],
  providers: [
    UsersService,
    JwtStrategy, // Ensure the JwtStrategy is added to providers
    JwtAuthGuard, // Add JwtAuthGuard to providers (if needed in some places)
    RolesGuard, // Add RolesGuard to providers
  ],
  exports: [UsersService],
})
export class UsersModule {}

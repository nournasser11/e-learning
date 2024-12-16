import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { EnrollmentService } from '../EnrollmentService/enroll.service';
import { EnrollmentController } from '../EnrollmentService/enroll.controller';
import { User, UserSchema } from '../models/user.schema';
import { Course, CourseSchema } from '../models/courses.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: Course.name, schema: CourseSchema },
    ]),
  ],
  controllers: [EnrollmentController],
  providers: [EnrollmentService],
  exports: [EnrollmentService],
})
export class EnrollmentModule {}

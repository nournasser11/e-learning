import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { EnrollmentService } from './enroll.service';
import { EnrollmentController } from './enroll.controller';
import { EnrollmentSchema, Enrollment} from './enroll.service';
import { User, UserSchema } from '../models/user.schema'; // Adjust the path based on your structure
import { Course, CourseSchema } from '../models/courses.schema'; // Adjust the path based on your structure

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Enrollment.name, schema: EnrollmentSchema },
      { name: User.name, schema: UserSchema },
      { name: Course.name, schema: CourseSchema },
    ]),
  ],
  controllers: [EnrollmentController],
  providers: [EnrollmentService],
  exports: [EnrollmentService],
})
export class EnrollmentModule {}

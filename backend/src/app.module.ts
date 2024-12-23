import { Module, Logger } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CourseModule } from './courses/courses.module';
import { ModuleCourseModule } from './module/module-course.module';
import { QuizzesModule } from './quizzes/quizzes.module';
import { ResponsesModule } from './responses/responses.module';
import { ProgressModule } from './progress/progress.module';
import { MongooseModule } from '@nestjs/mongoose';
import { ServeStaticModule } from '@nestjs/serve-static';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { SomeModule } from './some/some.module';
import { QuestionModule } from './questions/question.module';
import { ChatModule } from './chatting/ChatModule';
import { NotesModule } from './notes/notes.module';
import { UploadModule } from './module/UploadModule';
import { join } from 'path'; // Correctly import join from 'path'
import { EnrollmentModule } from './EnrollmentService/enroll.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, // Loads environment variables globally
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async () => {
        const uri = 'mongodb+srv://nournasser1556:nournasser@cluster0.7ptut.mongodb.net/ProjectSW';
        Logger.log(`Hardcoded MongoDB URI: ${uri}`);
        return { uri };
      },
      inject: [ConfigService],
    }),
    JwtModule.register({
      secret: process.env.JWT_SECRET || '10',
      signOptions: { expiresIn: '1h' },
    }),
    UsersModule,
    EnrollmentModule,
    QuizzesModule,
    CourseModule,
    ResponsesModule,
    ProgressModule,
    QuestionModule,
    ModuleCourseModule,
    ChatModule,
     NotesModule,
    UploadModule,
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'uploads'), // Serve files from the uploads folder
      serveRoot: '/uploads', // Access files via the "/uploads" path
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

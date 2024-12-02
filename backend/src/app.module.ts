import { Module,Logger } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersService } from './users/users.service';
import { AdminModule } from './admin/admin.module';
import { CourseModule } from './courses/courses.module';
import { ModulesModule } from './module/module-course.module';
import { QuizzesModule } from './quizzes/quizzes.module';
import { ResponsesModule } from './responses/responses.module';
import { ProgressModule } from './progress/progress.module';
import { UserInteractionsModule } from './user_interactions/user_interactions.module';
import { RecommendationsModule } from './recommendations/recommendations.module';
import {MongooseModule} from '@nestjs/mongoose';
import { UsersController } from './users/users.controller';
import { CoursesController } from './courses/courses.controller';
import { CoursesService } from './courses/courses.service';
import { QuizzesController } from './quizzes/quizzes.controller';
import { QuizzesService } from './quizzes/quizzes.service';
import { ResponsesController } from './responses/responses.controller';
import { ResponsesService } from './responses/responses.service';
import { ProgressController } from './progress/progress.controller';
import { ProgressService } from './progress/progress.service';
import { UserInteractionsController } from './user_interactions/user_interactions.controller';
import { UserInteractionsService } from './user_interactions/user_interactions.service';
import { RecommendationsController } from './recommendations/recommendations.controller';
import { RecommendationsService } from './recommendations/recommendations.service';
import { ModulesCourseController } from './modules-course/modules-course.controller';
import { ModulesCourseService } from './modules-course/modules-course.service';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { AuthController } from './auth/auth.controller';
import { AuthService } from './auth/auth.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { SomeService } from './some/some.service';
import { SomeModule } from './some/some.module';
import { NotesModule } from './notes/notes.module';
import config from './config/keys';
import { QuestionModule } from './questions/question.module';


@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, // Loads environment variables globally
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async () => {
        // Hardcoded URI for debugging purposes
        const uri = 'mongodb+srv://nournasser1556:nournasser@cluster0.7ptut.mongodb.net/';
        Logger.log(`Hardcoded MongoDB URI: ${uri}`);
        return {
          uri,
        };
      },
      inject:[ConfigService],
    }),
    UsersModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
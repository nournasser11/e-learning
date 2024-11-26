import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersService } from './users/users.service';
import { AdminModule } from './admin/admin.module';
import { CoursesModule } from './courses/courses.module';
import { ModulesModule } from './modules/modules.module';
import { QuizzesModule } from './quizzes/quizzes.module';
import { ResponsesModule } from './responses/responses.module';
import { ProgressModule } from './progress/progress.module';
import { UserInteractionsModule } from './user_interactions/user_interactions.module';
import { RecommendationsModule } from './recommendations/recommendations.module';
import { ModulesCourseModule } from './modules-course/modules-course.module';
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
@Module({
  imports: [AdminModule, CoursesModule, ModulesModule, QuizzesModule, ResponsesModule, ProgressModule, UserInteractionsModule, RecommendationsModule, ModulesCourseModule,MongooseModule.forRoot('mongodb://localhost/nest'), UsersModule, AuthModule],//hankteb el connection beta3v el db beta3na hena
  controllers: [AppController, UsersController],
  providers: [AppService, UsersService],
})
export class AppModule {}

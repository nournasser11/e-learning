import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { QuizzesController } from './quizzes.controller';
import { QuizzesService } from './quizzes.service';
import { Quiz, QuizSchema } from '../models/quizzes.schema';
import { Response, ResponseSchema } from '../models/responses.schema';
import { Progress, ProgressSchema } from '../models/progress.schema';
import { ResponsesModule } from 'src/responses/responses.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Quiz.name, schema: QuizSchema },
      { name: Response.name, schema: ResponseSchema },
      { name: Progress.name, schema: ProgressSchema },
    ]),
    ResponsesModule,
  ],
  controllers: [QuizzesController],
  providers: [QuizzesService],
})
export class QuizzesModule {}
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Quiz, QuizSchema } from '../models/quizzes.Schema';
import { QuizzesService } from './quizzes.service';
import { QuizController } from './quizzes.controller';

@Module({
  imports: [MongooseModule.forFeature([{ name: Quiz.name, schema: QuizSchema }])],
  controllers: [QuizController],
  providers: [QuizzesService],
  exports: [QuizzesService],
})
export class QuizzesModule {}

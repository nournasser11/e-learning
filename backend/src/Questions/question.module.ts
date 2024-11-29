import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { QuestionService } from './questions.service';
import { QuestionController } from './question.controller';
import { Question, QuestionSchema } from '../models/questions.schema';

@Module({
  imports: [
    // Registering the Question schema with Mongoose
    MongooseModule.forFeature([{ name: Question.name, schema: QuestionSchema }]),
  ],
  controllers: [QuestionController],
  providers: [QuestionService],
  exports: [QuestionService], // Export the service to be used in other modules
})
export class QuestionModule {}

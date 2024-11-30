import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Quiz, QuizDocument } from '../models/quizzes.Schema';
import { Response} from '../models/responses.Schema'; // Assuming you have a Response schema to store student responses
import { GenerateQuizDto } from '../dto/generate-quiz.dto'; // DTO for generating quizzes
import { QuestionService } from '../Questions/questions.service'; // Assuming you have a Question service to get questions based on difficulty

@Injectable()
export class QuizzesService {
}
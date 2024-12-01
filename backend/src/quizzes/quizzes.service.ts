import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateQuizDto } from '../dto/create-quiz.dto';
import { Quiz, QuizDocument } from '../models/quizzes.schema';
import { Response, ResponseDocument } from '../models/responses.schema';
import { Progress, ProgressDocument } from '../models/progress.schema';

@Injectable()
export class QuizzesService {
  constructor(
    @InjectModel(Quiz.name) private quizModel: Model<QuizDocument>,
    @InjectModel(Response.name) private responseModel: Model<ResponseDocument>,
    @InjectModel(Progress.name) private progressModel: Model<ProgressDocument>,
  ) {}

  async create(createQuizDto: CreateQuizDto): Promise<Quiz> {
    const newQuiz = new this.quizModel(createQuizDto);
    return newQuiz.save();
  }

  async findAll(): Promise<Quiz[]> {
    return this.quizModel.find().exec();
  }

  async findOne(id: string): Promise<Quiz> {
    return this.quizModel.findById(id).exec();
  }

  async remove(id: string): Promise<Quiz> {
    return this.quizModel.findByIdAndDelete(id).exec();
  }

  async generateAdaptiveQuiz(userId: string, moduleId: string): Promise<Quiz> {
    // Fetch user progress
    const progress = await this.progressModel.findOne({ userId, moduleId }).exec();
    if (!progress) {
      throw new Error('User progress not found');
    }

    // Determine difficulty level based on user performance
    let difficultyLevel: string;
    if (progress.completionPercentage < 50) {
      difficultyLevel = 'Beginner';
    } else if (progress.completionPercentage < 80) {
      difficultyLevel = 'Intermediate';
    } else {
      difficultyLevel = 'Advanced';
    }

    // Fetch questions based on difficulty level
    const questions = await this.quizModel.aggregate([
      { $match: { moduleId, difficultyLevel } },
      { $sample: { size: 10 } }, // Adjust the number of questions as needed
    ]);

    // Create adaptive quiz
    const adaptiveQuiz = new this.quizModel({
      quizId: `adaptive_${userId}_${moduleId}`,
      moduleId,
      questions,
    });

    return adaptiveQuiz.save();
  }

  async submitQuizResponse(userId: string, quizId: string, answers: any[]): Promise<{ response: Response, feedback: any[] }> {
    // Calculate score
    const quiz = await this.quizModel.findById(quizId).exec();
    if (!quiz) {
      throw new Error('Quiz not found');
    }

    let score = 0;
    const feedback = quiz.questions.map((question, index) => {
      const isCorrect = question.correctAnswer === answers[index];
      if (isCorrect) {
        score += 1;
      }
      return {
        question: question.questionText,
        correctAnswer: question.correctAnswer,
        userAnswer: answers[index],
        isCorrect,
      };
    });

    // Save response
    const response = new this.responseModel({
      responseId: `response_${userId}_${quizId}`,
      userId,
      quizId,
      answers,
      score,
      submittedAt: new Date(),
    });

    await response.save();

    return { response, feedback };
  }
}
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Quiz, QuizDocument } from '../models/quizzes.Schema';
import { Response} from '../models/responses.Schema'; // Assuming you have a Response schema to store student responses
import { GenerateQuizDto } from '../dto/generate-quiz.dto'; // DTO for generating quizzes
import { QuestionService } from '../Questions/questions.service'; // Assuming you have a Question service to get questions based on difficulty

@Injectable()
export class QuizzesService {
  constructor(
    @InjectModel(Quiz.name) private quizModel: Model<QuizDocument>,
    @InjectModel(Response.name) private responseModel: Model<Response>, // Injecting Response model to fetch student performance data
    private readonly questionService: QuestionService, // Injecting Question service
  ) {}

  // Method to generate a quiz for a student
  async generateQuiz(generateQuizDto: GenerateQuizDto): Promise<Quiz> {
    const { userId, questionCount, questionTypes, moduleId } = generateQuizDto;

    // Fetch the student's performance history
    const studentHistory = await this.getStudentPerformance(userId);

    // Default performance level for new students
    let userPerformance = 'average';

    // If the student has performance history, calculate their performance level
    if (studentHistory) {
      const correctRate = studentHistory.correctAnswers / studentHistory.totalQuestions;
      userPerformance =
        correctRate < 0.5 ? 'low' : correctRate === 0.5 ? 'average' : 'high';
    }

    // Determine the allowed difficulty levels based on the student's performance
    const allowedDifficulties =
      userPerformance === 'average'
        ? ['easy', 'medium']
        : userPerformance === 'high'
        ? ['medium', 'hard']
        : ['easy'];

    // Fetch questions based on performance level and requested criteria
    const questions = await this.questionService.getQuestionsByCriteria(
      allowedDifficulties,
      questionTypes,
      questionCount,
    );

    // Create a new quiz document
    const newQuiz = new this.quizModel({
      moduleId,
      questions,
      createdAt: new Date(),
    });

    // Save the new quiz in the database
    return newQuiz.save();
  }

  // Fetch the student's performance history from the database
  async getStudentPerformance(userId: string): Promise<{ correctAnswers: number; totalQuestions: number } | null> {
    // Query the Response collection to get the performance data of the student
    const history = await this.responseModel.findOne({ userId }).exec();
    return history
      ? { correctAnswers: history.toObject().correctAnswers, totalQuestions: history.toObject().totalQuestions }
      : null;
  }

  // Method to create a new quiz manually (e.g., for instructors)
  async createQuiz(moduleId: string, questions: Record<string, any>[]): Promise<Quiz> {
    const quiz = new this.quizModel({
      moduleId,
      questions,
    });

    return quiz.save();
  }

  // Fetch a quiz by its ID
  async getQuizById(quizId: string): Promise<Quiz | null> {
    return this.quizModel.findById(quizId).exec();
  }

  // Fetch all quizzes
  async getAllQuizzes(): Promise<Quiz[]> {
    return this.quizModel.find().exec();
  }

  // Fetch quizzes based on a specific module
  async getQuizzesByModule(moduleId: string): Promise<Quiz[]> {
    return this.quizModel.find({ moduleId }).exec();
  }

  // Method to update an existing quiz (if needed, for example, updating questions or difficulty)
  async updateQuiz(quizId: string, updateData: Partial<Quiz>): Promise<Quiz | null> {
    return this.quizModel.findByIdAndUpdate(quizId, updateData, { new: true }).exec();
  }

  // Method to delete a quiz (in case of errors or instructor request)
  async deleteQuiz(quizId: string): Promise<void> {
    await this.quizModel.findByIdAndDelete(quizId).exec();
  }
}

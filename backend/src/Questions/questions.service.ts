import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Question, QuestionDocument } from '../models/questions.schema';

@Injectable()
export class QuestionService {
  constructor(
    @InjectModel(Question.name) private readonly questionModel: Model<QuestionDocument>,
  ) {}

  /**
   * Fetch questions based on difficulty, type, and count.
   */
  async getQuestionsByCriteria(
    allowedDifficulties: string[], 
    questionTypes: string[], 
    questionCount: number,
  ): Promise<Record<string, any>[]> {
    const query = {
      difficulty: { $in: allowedDifficulties },
      type: { $in: questionTypes },
    };

    const questions = await this.questionModel
      .find(query)
      .limit(questionCount)
      .exec();

    return questions.map((question) => ({
      questionId: question._id,
      questionText: question.text,
      options: question.options,
    }));
  }

  /**
   * Fetch all questions.
   */
  async getAllQuestions(): Promise<Question[]> {
    return this.questionModel.find().exec();
  }

  /**
   * Add a new question to the database.
   */
  async addQuestion(questionData: Record<string, any>): Promise<Question> {
    const newQuestion = new this.questionModel(questionData);
    return newQuestion.save();
  }

  /**
   * Fetch questions by module ID.
   */
  async getQuestionsByModule(moduleId: string): Promise<Question[]> {
    return this.questionModel.find({ moduleId }).exec();
  }

  /**
   * Update an existing question.
   */
  async updateQuestion(questionId: string, updateData: Partial<Question>): Promise<Question | null> {
    return this.questionModel.findByIdAndUpdate(questionId, updateData, { new: true }).exec();
  }

  /**
   * Delete a question by its ID.
   */
  async deleteQuestion(questionId: string): Promise<void> {
    await this.questionModel.findByIdAndDelete(questionId).exec();
  }

  /**
   * Fetch a specific question by its ID.
   */
  async getQuestionById(questionId: string): Promise<Question | null> {
    return this.questionModel.findById(questionId).exec();
  }

  /**
   * Filter questions by criteria (e.g., difficulty or type).
   */
  async filterQuestions(criteria: { difficulty?: string; type?: string }): Promise<Question[]> {
    const query = {};
    if (criteria.difficulty) {
      query['difficulty'] = criteria.difficulty;
    }
    if (criteria.type) {
      query['type'] = criteria.type;
    }
    return this.questionModel.find(query).exec();
  }
}

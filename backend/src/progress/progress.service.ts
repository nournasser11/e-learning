import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Progress } from '../models/progress.Schema';
import{ Response,ResponseDocument } from '../models/responses.Schema';
import { CreateProgressDto } from '../dto/create-progress.dto';
import { UpdateProgressDto } from '../dto/update-progress.dto';
@Injectable()
export class ProgressService {
    constructor(
        @InjectModel(Progress.name) private progressModel: Model<Progress>,
        @InjectModel(Response.name) private responseModel: Model<ResponseDocument>
    ) {}

    async getStudentDashboard(userId: string) {
        const progress = await this.progressModel.find({ userid: userId }).exec();
        const totalCourses = progress.length;
        const completedCourses = progress.filter(p => p.completionPercentage === 100).length;
        const averageScore = progress.reduce((acc, p) => acc + p.completionPercentage, 0) / totalCourses;
        const engagementTrends = progress.map(p => ({
            courseId: p.courseId,
            lastAccessed: p.lastAccessed,
        }));

        return {
            totalCourses,
            completedCourses,
            averageScore,
            engagementTrends,
        };
    }

    // progress.service.ts
async getInstructorAnalytics(courseId: string) {
    const progress = await this.progressModel.find({ courseId }).exec();
    const studentEngagement = progress.map(p => ({
      userId: p.userId,
      courseId: p.courseId,
      completionPercentage: p.completionPercentage,
      lastAccessed: p.lastAccessed,
    }));
  
    // Calculate question-level insights
    const questionMisses = await this.responseModel.aggregate([
      { $match: { quizId: { $in: progress.map(p => p.quizId) } } },
      { $unwind: "$answers" },
      { $group: {
        _id: "$answers.questionId",
        missedCount: { $sum: { $cond: [{ $eq: ["$answers.isCorrect", false] }, 1, 0] } }
      }}
    ]);
  
    const contentEffectiveness = progress.reduce((acc, p) => {
      if (!acc[p.courseId]) {
        acc[p.courseId] = { total: 0, completed: 0 };
      }
      acc[p.courseId].total += 1;
      if (p.completionPercentage === 100) {
        acc[p.courseId].completed += 1;
      }
      return acc;
    }, {});
  
    const assessmentResults = progress.map(p => ({
      userId: p.userId,
      courseId: p.courseId,
      completionPercentage: p.completionPercentage,
    }));
  
    return {
      studentEngagement,
      contentEffectiveness,
      assessmentResults,
      questionMisses,  // New analytics data
    };
  }
  

    async getStudentProgress(userId: string) {
        const progress = await this.progressModel.find({ userId }).exec();
        return progress.map(p => ({
            courseId: p.courseId,
            completionPercentage: p.completionPercentage,
            lastAccessed: p.lastAccessed,
        }));
    }
    async createProgress(createProgressDto: CreateProgressDto): Promise<Progress> {
      const createdProgress = new this.progressModel(createProgressDto);
      return createdProgress.save();
    }
    async updateStudentProgress(userId: string, courseId: string, updateProgressDto: UpdateProgressDto): Promise<Progress> {
      // Find the progress record by userId and courseId
      const progress = await this.progressModel.findOne({ userId, courseId }).exec();
  
      // If the progress record exists, update it
      if (progress) {
        progress.completionPercentage = updateProgressDto.completionPercentage || progress.completionPercentage;
        progress.lastAccessed = updateProgressDto.lastAccessed || progress.lastAccessed;
  
        // Save the updated progress
        return progress.save();
      } else {
        // If the progress record does not exist, throw an error
        throw new Error('Progress record not found');
      }
    }
}
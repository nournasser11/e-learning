import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Progress } from '../models/progress.Schema';


@Injectable()
export class ProgressService {
    constructor(
        @InjectModel(Progress.name) private progressModel: Model<Progress>,
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

    async getInstructorAnalytics() {
        const progress = await this.progressModel.find().exec();
        const studentEngagement = progress.map(p => ({
            userId: p.userId,
            courseId: p.courseId,
            completionPercentage: p.completionPercentage,
            lastAccessed: p.lastAccessed,
        }));

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
}
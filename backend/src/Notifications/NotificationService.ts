import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Notification } from './NotificationSchema';
import { CreateNotificationDto } from './DTO/CreateNotificationDTO';
import { Course, CourseDocument, CourseStatus } from '../models/courses.Schema';

import { User } from '../models/user.Schema';

@Injectable()
export class NotificationService {
  constructor(
    @InjectModel(Notification.name) private notificationModel: Model<Notification>,
    @InjectModel(Course.name) private courseModel: Model<Course>, // For fetching course data
  ) { }

  // Create a new notification
  async create(createNotificationDto: CreateNotificationDto): Promise<Notification | Notification[]> {
    const { recipientId, senderId, type, content, courseId } = createNotificationDto;

    if (type === 'announcement') {
      // Ensure only instructors can make announcements
      const course = await this.courseModel
        .findById(courseId)
        .populate('assignedStudents', 'name email userId') // Populate student data
        .exec();

      if (!course) {
        throw new Error('Course not found.');
      }

      if (!course.assignedStudents || course.assignedStudents.length === 0) {
        throw new Error('No students are enrolled in this course.');
      }
      // Fetch assigned students from the course
      const notifications = await Promise.all(
        course.assignedStudents.map((studentId: Types.ObjectId) =>
          new this.notificationModel({
            recipientId: studentId.toString(), // Convert ObjectId to string
            senderId,
            type,
            content,
            courseId,
          }).save(),
        ),
      );
      return notifications; // Return the created notifications
    } else {
      // For messages and replies, create a single notification
      const notification = new this.notificationModel(createNotificationDto);
      return notification.save();
    }
  }

  // Fetch notifications for a user
  async findByUserId(userId: string): Promise<Notification[]> {
    return this.notificationModel.find({ recipientId: userId }).exec();
  }

  // Mark a notification as read
  async markAsRead(notificationId: string): Promise<Notification> {
    return this.notificationModel.findByIdAndUpdate(
      notificationId,
      { isRead: true },
      { new: true },
    ).exec();
  }
}

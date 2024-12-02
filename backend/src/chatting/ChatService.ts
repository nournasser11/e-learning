import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Message } from '../models/messages.Schema';

@Injectable()
export class ChatService {
  constructor(@InjectModel('Message') private readonly messageModel: Model<Message>) {}

  /**
   * Save a new message to the database
   * @param messageData - Data for the new message
   * @returns The saved message document
   */
  async saveMessage(messageData: { senderId: string; receiverId: string; content: string }): Promise<Message> {
    try {
      const newMessage = new this.messageModel(messageData);
      return await newMessage.save();
    } catch (error) {
      throw new Error(`Failed to save message: ${error.message}`);
    }
  }

  /**
   * Get chat history for a specific user
   * @param userId - ID of the user
   * @returns Array of messages involving the user
   */
  async getChatHistory(userId: string): Promise<Message[]> {
    try {
      return await this.messageModel
        .find({ $or: [{ senderId: userId }, { receiverId: userId }] })
        .sort({ createdAt: -1 }) // Sort by most recent
        .exec();
    } catch (error) {
      throw new Error(`Failed to retrieve chat history: ${error.message}`);
    }
  }

  /**
   * Mark a specific message as read
   * @param messageId - ID of the message to update
   * @returns The updated message document
   */
  async markMessageAsRead(messageId: string): Promise<Message> {
    try {
      const updatedMessage = await this.messageModel.findByIdAndUpdate(
        messageId,
        { isRead: true },
        { new: true }, // Return the updated document
      ).exec();

      if (!updatedMessage) {
        throw new NotFoundException(`Message with ID ${messageId} not found`);
      }

      return updatedMessage;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new Error(`Failed to mark message as read: ${error.message}`);
    }
  }

  
}

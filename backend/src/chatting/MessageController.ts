import { Controller, Post, Body, Get, Param, Patch, Query, BadRequestException, NotFoundException } from '@nestjs/common';
import { ChatService } from './ChatService';
import { Message } from '../models/messages.Schema';
import { SendMessageDto } from './SendMessageDto';
import { ReadMessageDto } from './ReadMessageDto';

@Controller('messages')
export class MessageController {
  constructor(private readonly chatService: ChatService) {}

  @Post()
  async sendMessage(@Body() sendMessageDto: SendMessageDto): Promise<Message> {
    const { senderId, receiverId, content } = sendMessageDto;
    return this.chatService.saveMessage({ senderId, receiverId, content });
  }

  @Get(':userId')
  async getChatHistory(@Param('userId') userId: string): Promise<Message[]> {
    return this.chatService.getChatHistory(userId);
  }

  @Patch(':messageId/read')
  async markAsRead(@Param() readMessageDto: ReadMessageDto): Promise<Message> {
    const { messageId } = readMessageDto;
    return this.chatService.markMessageAsRead(messageId);
  }
}
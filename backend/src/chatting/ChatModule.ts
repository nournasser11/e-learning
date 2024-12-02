import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Message, MessageSchema } from '../models/messages.Schema';
import { ChatService } from './ChatService';
import { WebSocketGatewayService } from './WebSocketGatewayService';
import { MessageController } from './MessageController';

@Module({
  imports: [MongooseModule.forFeature([{ name: Message.name, schema: MessageSchema }])],
  providers: [ChatService, WebSocketGatewayService],
  controllers: [MessageController],
  exports: [ChatService],
})
export class ChatModule {}
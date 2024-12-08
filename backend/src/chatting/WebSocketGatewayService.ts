import { SubscribeMessage, MessageBody, WebSocketGateway, WebSocketServer, OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect } from '@nestjs/websockets';
import { Logger } from '@nestjs/common';
import { Server, Socket } from 'socket.io';

import { ChatService } from './ChatService';

@WebSocketGateway(3002, {}) // Add CORS for cross-origin communication
export class WebSocketGatewayService implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  private users: Map<string, string> = new Map(); // Track users with their client IDs
  private readonly logger = new Logger(WebSocketGatewayService.name);

  constructor(private readonly chatService: ChatService) {}

  afterInit(server: Server) {
    this.logger.log('WebSocket server initialized');
  }

  

  handleConnection(client: Socket) {
    this.logger.log(`Client connected: ${client.id}`);

    client.on('register', (data: { userId: string }) => {
    const { userId } = data;
    if (userId) {
      this.users.set(client.id, userId); // Map the client socket ID to the user ID
      this.logger.log(`User registered: ${userId}`);
    } else {
      this.logger.warn('Register event received without a userId');
    }
    });
  }
  

  handleDisconnect(client: Socket) {
    this.logger.log(`Client disconnected: ${client.id}`);
    this.users.delete(client.id);
  }

  @SubscribeMessage('sendMessage')
  async handleSendMessage(
    @MessageBody() data: { senderId: string; receiverId: string; message: string },
  ): Promise<void> {
    const { senderId, receiverId, message } = data;
    try {
      // Emit the message to the receiver
      const receiverSocket = [...this.users.entries()].find(([_, id]) => id === receiverId)?.[0];
      if (receiverSocket) {
        this.server.to(receiverSocket).emit('chatMessage', { senderId, message });
      }
      this.logger.log(`Message sent from ${senderId} to ${receiverId}: ${message}`);

      // Save the message to the database
      await this.chatService.saveMessage({ senderId, receiverId, content: message });
    } catch (error) {
      this.logger.error(`Error while sending message: ${(error as Error).message}`);
    }
  }
}

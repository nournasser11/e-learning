import { WebSocketGateway, WebSocketServer, OnGatewayInit } from '@nestjs/websockets';
import { Server } from 'socket.io';

@WebSocketGateway()
export class WebSocketGatewayService implements OnGatewayInit {
  @WebSocketServer()
  server: Server;

  afterInit() {
    console.log('WebSocket Gateway Initialized');
  }

  sendNotification(notification: any) {
    this.server.emit('notification', notification); // Emitting to all connected clients
  }
}

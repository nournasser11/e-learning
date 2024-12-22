import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Notification, NotificationSchema } from './NotificationSchema'; // Define a schema for notifications
import { NotificationService } from './NotificationService'; // Service for handling notification logic
import { WebSocketGatewayService } from './WebSocketGateway'; // Reuse if notifications need real-time updates
import { NotificationController } from './NotificationController'; // Controller to handle API endpoints
import { CourseModule } from '../courses/courses.module';
// Import the module that exports CourseModel


@Module({
  imports: [MongooseModule.forFeature([{ name: Notification.name, schema: NotificationSchema }]), CourseModule],
  providers: [NotificationService, WebSocketGatewayService],
  controllers: [NotificationController],
  exports: [NotificationService],
})
export class NotificationModule { }

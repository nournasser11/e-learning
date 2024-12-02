import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ResponsesService } from './responses.service';
import { ResponsesController } from './responses.controller';
import { Response, ResponseSchema } from '../models/responses.schema';

@Module({
  imports: [
    // Register the Response schema with Mongoose
    MongooseModule.forFeature([{ name: Response.name, schema: ResponseSchema }]),
  ],
  controllers: [ResponsesController], // Include the controller
  providers: [ResponsesService], // Include the service
  exports: [ResponsesService], // Export the service for use in other modules
})
export class ResponsesModule {}

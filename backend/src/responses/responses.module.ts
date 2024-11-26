import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Response, ResponseSchema } from '../models/responses.schema';
import { ResponsesService } from './responses.service';
import { ResponsesController } from './responses.controller';

@Module({
  imports: [MongooseModule.forFeature([{ name: Response.name, schema: ResponseSchema }])],
  controllers: [ResponsesController],
  providers: [ResponsesService],
  exports: [ResponsesService],
})
export class ResponsesModule {}

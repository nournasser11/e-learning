import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Progress, ProgressSchema } from '../models/progress.schema';
import { ProgressService } from './progress.service';
import { ProgressController } from './progress.controller';
import { Response, ResponseSchema } from '../models/responses.schema';
@Module({
  imports: [
    MongooseModule.forFeature([{ name: Progress.name, schema: ProgressSchema }]),
    MongooseModule.forFeature([{ name: Response.name, schema: ResponseSchema }]), // Add Response model here
  ],
  controllers: [ProgressController],
  providers: [ProgressService],
  exports: [ProgressService],
})
export class ProgressModule {}

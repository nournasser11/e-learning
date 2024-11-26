import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UserInteraction, UserInteractionSchema } from '../models/userinteractions.schema';
import { UserInteractionsService } from './user_interactions.service';
import { UserInteractionsController } from './user_interactions.controller';

@Module({
  imports: [MongooseModule.forFeature([{ name: UserInteraction.name, schema: UserInteractionSchema }])],
  controllers: [UserInteractionsController],
  providers: [UserInteractionsService],
  exports: [UserInteractionsService],
})
export class UserInteractionsModule {}

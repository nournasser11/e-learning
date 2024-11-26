import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Recommendation, RecommendationSchema } from '../models/recommendations.schema';
import { RecommendationsService } from './recommendations.service';
import { RecommendationsController } from './recommendations.controller';

@Module({
  imports: [MongooseModule.forFeature([{ name: Recommendation.name, schema: RecommendationSchema }])],
  controllers: [RecommendationsController],
  providers: [RecommendationsService],
  exports: [RecommendationsService],
})
export class RecommendationsModule {}

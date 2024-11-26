
import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import{ Document } from 'mongoose';
@Schema({ timestamps: true })
export class Recommendation {
  @Prop({ required: true })
  recommendationId: string;

  @Prop({ required: true })
  userId: string;

  @Prop({ required: true, type: [String] })
  recommendedItems: string[];

  @Prop({ default: Date.now })
  generatedAt: Date;
}

export const RecommendationSchema = SchemaFactory.createForClass(Recommendation);

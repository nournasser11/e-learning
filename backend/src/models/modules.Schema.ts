import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document, Schema as MongooseSchema } from 'mongoose';
import { IsOptional, IsString } from 'class-validator';

export type ModuleDocument = Module & Document;

@Schema()
export class Question {
  @Prop({ required: true })
  questionText: string;

  @Prop({
    required: true,
    enum: ['MCQ', 'True/False'], // Restrict to MCQ or True/False
  })
  type: string;

  @Prop({
    type: [String],
    validate: {
      validator: function (options: string[]) {
        if ((this as any).type === 'MCQ') {
          return options && options.length >= 2; // At least two options required for MCQ
        }
        return true; // Skip validation for True/False
      },
      message: 'MCQ questions must have at least two options.',
    },
  })
  options?: string[]; // Optional for True/False

  @Prop({ required: true })
  correctAnswer: string; // For True/False: "True" or "False"
}

export const QuestionSchema = SchemaFactory.createForClass(Question);

@Schema()
export class QuizConfiguration {
  @Prop({
    type: [String],
    required: true,
    enum: ['MCQ', 'True/False'], // Allow specifying one or both types
  })
  questionTypes: string[];

  @Prop({
    required: true,
    min: [1, 'Number of questions must be at least 1.'],
  })
  numberOfQuestions: number; // Total number of questions in the quiz
}

export const QuizConfigurationSchema = SchemaFactory.createForClass(QuizConfiguration);

@Schema({ timestamps: true })
export class Module {
  @Prop({ unique: true })
  moduleId!: string;

  @Prop({ required: true, type: MongooseSchema.Types.ObjectId, ref: 'Course' })
  courseId!: MongooseSchema.Types.ObjectId;

  @IsOptional()
  @IsString()
  file?: string; // Store the filename or file path for uploaded content

  @Prop({ required: true })
  title!: string;

  @Prop({ required: true })
  contentUrl!: string; // URL of the multimedia

  @Prop({ required: true, enum: ['pdf', 'video'] })
  contentType!: 'pdf' | 'video'; // Type ('pdf' or 'video')

  @Prop({ type: [String], default: [] })
  resources?: string[];

  @Prop({ type: [QuestionSchema], default: [] }) // Question bank
  questionBank: Question[];

  @Prop({ type: QuizConfigurationSchema, required: true })
  quizConfiguration: QuizConfiguration;

  @Prop({ type: String, enum: ['easy', 'medium', 'hard'], required: true })
  difficultyLevel!: string;

  @Prop({ type: Boolean, default: false })
  isFlagged!: boolean;
}

export const ModuleSchema = SchemaFactory.createForClass(Module);

// Automatically set moduleId to _id when the document is saved
ModuleSchema.pre('save', function (next) {
  this.moduleId = this._id.toString();
  next();
});

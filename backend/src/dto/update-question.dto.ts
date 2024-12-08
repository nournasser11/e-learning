import { Difficulty } from "src/models/questions.schema";

export class UpdateQuestionDto {
    text?: string;
    options?: string[];
    correctAnswer?: string;
    difficulty?: Difficulty;
    type?: string;
  }

  
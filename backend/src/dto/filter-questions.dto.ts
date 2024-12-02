export class FilterQuestionsDto {
    readonly difficulty?: 'easy' | 'medium' | 'hard';
    readonly type?: 'mcq' | 'true_false';
    readonly limit?: number;
  }
  
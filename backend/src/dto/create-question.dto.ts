export class CreateQuestionDto {
    readonly title: string;
    readonly description: string;
    readonly options: string[];
    readonly correctAnswer: string;
    readonly difficulty: 'easy' | 'medium' | 'hard';

    constructor(
        title: string,
        description: string,
        options: string[],
        correctAnswer: string,
        difficulty: 'easy' | 'medium' | 'hard'
    ) {
        this.title = title;
        this.description = description;
        this.options = options;
        this.correctAnswer = correctAnswer;
        this.difficulty = difficulty;
    }
}
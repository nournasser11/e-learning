export class CreateResponseDto {
    readonly questionId: string;
    readonly userId: string;
    readonly responseText: string;
    readonly createdAt: Date;

    constructor(questionId: string, userId: string, responseText: string) {
        this.questionId = questionId;
        this.userId = userId;
        this.responseText = responseText;
        this.createdAt = new Date();
    }
}
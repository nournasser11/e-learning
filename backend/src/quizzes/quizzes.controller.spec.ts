import { Test, TestingModule } from '@nestjs/testing';
import { QuizController } from './quizzes.controller';

describe('QuizzesController', () => {
  let controller: QuizController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [QuizController],
    }).compile();

    controller = module.get<QuizController>(QuizController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});

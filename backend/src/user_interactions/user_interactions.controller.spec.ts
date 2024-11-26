import { Test, TestingModule } from '@nestjs/testing';
import { UserInteractionsController } from './user_interactions.controller';

describe('UserInteractionsController', () => {
  let controller: UserInteractionsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserInteractionsController],
    }).compile();

    controller = module.get<UserInteractionsController>(UserInteractionsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});

import { Test, TestingModule } from '@nestjs/testing';
import { UserInteractionsService } from './user_interactions.service';

describe('UserInteractionsService', () => {
  let service: UserInteractionsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UserInteractionsService],
    }).compile();

    service = module.get<UserInteractionsService>(UserInteractionsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});

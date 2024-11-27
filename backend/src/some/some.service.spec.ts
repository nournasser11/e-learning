import { Test, TestingModule } from '@nestjs/testing';
import { SomeService } from './some.service';

describe('SomeService', () => {
  let service: SomeService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SomeService],
    }).compile();

    service = module.get<SomeService>(SomeService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});

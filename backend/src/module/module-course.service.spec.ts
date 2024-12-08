import { Test, TestingModule } from '@nestjs/testing';
import { ModuleService } from './module-course.service';

describe('ModulesCourseService', () => {
  let service: ModuleService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ModuleService],
    }).compile();

    service = module.get<ModuleService>(ModuleService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});

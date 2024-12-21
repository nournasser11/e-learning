import { Test, TestingModule } from '@nestjs/testing';
import { ModulesService } from './module-course.service';

describe('ModulesCourseService', () => {
  let service: ModulesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ModulesService],
    }).compile();

    service = module.get<ModulesService>(ModulesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});

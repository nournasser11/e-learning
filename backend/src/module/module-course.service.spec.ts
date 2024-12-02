import { Test, TestingModule } from '@nestjs/testing';
import { ModulesCourseService } from './module-course.service';

describe('ModulesCourseService', () => {
  let service: ModulesCourseService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ModulesCourseService],
    }).compile();

    service = module.get<ModulesCourseService>(ModulesCourseService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});

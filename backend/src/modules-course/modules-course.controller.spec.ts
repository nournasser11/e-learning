import { Test, TestingModule } from '@nestjs/testing';
import { ModulesCourseController } from './modules-course.controller';

describe('ModulesCourseController', () => {
  let controller: ModulesCourseController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ModulesCourseController],
    }).compile();

    controller = module.get<ModulesCourseController>(ModulesCourseController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});

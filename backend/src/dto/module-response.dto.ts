export class ModuleResponseDto {
    moduleId: string;
    courseId: string;
    title: string;
    content: string;
    resources?: string[];
    createdAt: Date;
    updatedAt: Date;
  }
  
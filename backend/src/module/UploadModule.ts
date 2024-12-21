import { Module } from '@nestjs/common';
import { UploadController } from './upload.controller';
import { UploadService } from './UploadService';

@Module({
  controllers: [UploadController],
  providers: [UploadService],
  exports: [UploadService], // Exporting allows reuse in other modules
})
export class UploadModule {}

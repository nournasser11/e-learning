import {
  Controller,
  Post,
  UploadedFile,
  Body,
  UseInterceptors,
  BadRequestException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import * as path from 'path';

const FILE_UPLOADS_DIR = './uploads';

export const fileNameEditor = (req: any, file: any, callback: (error: any, filename: string) => void) => {
  console.log('Inside fileNameEditor:', file.originalname);
  const newFileName = `${Date.now()}-${file.originalname}`;
  callback(null, newFileName);
};

export const imageFileFilter = (req: any, file: any, callback: (error: any, acceptFile: boolean) => void) => {
  console.log('Inside imageFileFilter:', file.mimetype);
  const allowedMimeTypes = ['application/pdf', 'image/jpeg', 'image/png'];
  if (!allowedMimeTypes.includes(file.mimetype)) {
    return callback(new BadRequestException(`Unsupported file type: ${file.mimetype}`), false);
  }
  callback(null, true);
};

@Controller('upload')
export class UploadController {
  @Post('pdf')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: FILE_UPLOADS_DIR,
        filename: fileNameEditor,
      }),
      limits: {
        fileSize: 10 * 1024 * 1024, // 10MB file size limit
      },
      fileFilter: imageFileFilter,
    }),
  )
  async upload(
    @UploadedFile() file: Express.Multer.File,
    @Body() dto: { description?: string },
  ) {
    if (!file) {
      throw new BadRequestException('No file uploaded.');
    }

    console.log('Uploaded File:', file);
    console.log('DTO:', dto);

    return {
      filename: file.filename,
      size: file.size,
      dto,
      filePath: `/uploads/${file.filename}`,
    };
  }
}

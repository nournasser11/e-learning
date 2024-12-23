import { Injectable, BadRequestException } from '@nestjs/common';
import * as path from 'path';
import * as fs from 'fs';

@Injectable()
export class UploadService {
  private readonly uploadDir = './uploads';

  constructor() {
    // Ensure upload directory exists at service initialization
    if (!fs.existsSync(this.uploadDir)) {
      fs.mkdirSync(this.uploadDir, { recursive: true });
    }
  }

  validateFileType(mimetype: string): void {
    const allowedMimeTypes = ['application/pdf', 'video/mp4', 'video/mkv', 'video/webm'];
    if (!allowedMimeTypes.includes(mimetype)) {
      throw new BadRequestException(
        `Unsupported file type: ${mimetype}. Allowed types are PDF, MP4, MKV, WebM.`,
      );
    }
  }

  generateFileName(originalName: string): string {
    const fileExtName = path.extname(originalName);
    return `${Date.now()}-${originalName}`;
  }

  getFileUrl(filename: string): string {
    const baseUrl = process.env.BASE_URL || 'http://localhost:3000';
    return `${baseUrl}/uploads/${filename}`;
  }

  saveFileMetadata(filename: string, fileUrl: string): void {
    console.log(`File saved: ${filename}, URL: ${fileUrl}`);
    // You can implement database logic here if needed
  }

  async deleteFile(filename: string): Promise<void> {
    const filePath = path.join(this.uploadDir, filename);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
      console.log(`File deleted: ${filePath}`);
    } else {
      console.error(`File not found: ${filePath}`);
      throw new BadRequestException('File not found.');
    }
  }
}

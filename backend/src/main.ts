import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import * as dotenv from 'dotenv';
import * as cors from 'cors';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import { diskStorage } from 'multer';
import { MulterModule } from '@nestjs/platform-express';

dotenv.config();

async function bootstrap() {
  console.log('MONGODB_URI:', process.env.MONGODB_URI);
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.useGlobalPipes(new ValidationPipe());
  app.useLogger(['log', 'error', 'warn', 'debug', 'verbose']);
  app.use(cors());

  // Serve static files from the 'uploads' folder
  app.useStaticAssets(join(__dirname, '..', 'uploads'), {
    prefix: '/uploads/',
  });

  // Configure MulterModule for file uploads
  MulterModule.register({
    storage: diskStorage({
      destination: './uploads/profile-pictures',
      filename: (req, file, cb) => {
        const uniqueName = `${Date.now()}-${file.originalname}`;
        cb(null, uniqueName);
      },
    }),
  });

  await app.listen(3000);
  console.log('Server is running on http://localhost:3000');
}

bootstrap();

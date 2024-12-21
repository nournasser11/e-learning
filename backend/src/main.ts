import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import * as dotenv from 'dotenv';
import * as cors from 'cors';
import { NestExpressApplication } from '@nestjs/platform-express';
import * as path from 'path';

dotenv.config();

async function bootstrap() {
  // Log the MongoDB URI for debugging purposes
  console.log('MONGODB_URI:', process.env.MONGODB_URI);

  // Create the Nest application as a NestExpressApplication
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  // Apply global validation pipes for DTO validation
  app.useGlobalPipes(new ValidationPipe());

  // Enable CORS for cross-origin requests
  app.use(cors());

  // Serve static assets from the "uploads" folder
  app.useStaticAssets(path.join(__dirname, '..', 'uploads'), {
    prefix: '/uploads', // Accessible via "/uploads" URL
  });


  // Start the server and listen on port 3000
  const port = process.env.PORT || 3000;
  console.log(`Application is running on: http://localhost:${port}`);
  await app.listen(port);
}

bootstrap();

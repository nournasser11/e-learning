import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import * as dotenv from 'dotenv';
import * as cors from 'cors';
dotenv.config();
async function bootstrap() {
  console.log('MONGODB_URI:', process.env.MONGODB_URI);
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe());
  app.useLogger(['log', 'error', 'warn', 'debug', 'verbose']);
  app.use(cors());
  await app.listen(3000);
}
bootstrap();

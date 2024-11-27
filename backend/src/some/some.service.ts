import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class SomeService {
  constructor(private configService: ConfigService) {
    const dbUri = this.configService.get<string>('MONGODB_URI');
    console.log('mongodb+srv://nournasser1556:nournasser@cluster0.7ptut.mongodb.net/', dbUri);
  }
}
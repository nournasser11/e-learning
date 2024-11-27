import { Module } from '@nestjs/common';
import { SomeService } from './some.service';
import { ConfigModule } from '@nestjs/config';
@Module({
    imports:[ConfigModule],
  providers: [SomeService],
  exports: [SomeService],
})
export class SomeModule {}
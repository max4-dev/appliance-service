import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from '@src/common/database';
import { RequestController } from './request.controller';
import { RequestService } from './request.service';

@Module({
  imports: [ConfigModule, DatabaseModule],
  controllers: [RequestController],
  providers: [RequestService],
})
export class RequestModule {}

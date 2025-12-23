import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from '@src/common/database';
import { OrderedPartController } from './ordered-part.controller';
import { OrderedPartService } from './ordered-part.service';

@Module({
  imports: [ConfigModule, DatabaseModule],
  controllers: [OrderedPartController],
  providers: [OrderedPartService],
})
export class OrderedPartModule {}

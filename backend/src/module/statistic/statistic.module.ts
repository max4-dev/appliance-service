import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from '@src/common/database';
import { StatisticController } from './statistic.controller';
import { StatisticService } from './statistic.service';

@Module({
  imports: [ConfigModule, DatabaseModule],
  controllers: [StatisticController],
  providers: [StatisticService],
})
export class StatisticModule {}

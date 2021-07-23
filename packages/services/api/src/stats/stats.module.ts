import { Module } from '@nestjs/common';
import { StatsService } from './stats.service';
import { StatsResolver } from './stats.resolver';

@Module({
  providers: [StatsService, StatsResolver]
})
export class StatsModule {}

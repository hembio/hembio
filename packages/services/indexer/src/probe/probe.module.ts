import { Module } from '@nestjs/common';
import { ProbeService } from './probe.service';

@Module({
  providers: [ProbeService]
})
export class ProbeModule {}

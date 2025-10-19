import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LookupsController } from './lookups.controller';
import { LookupsService } from './lookups.service';
import { Lookup } from './lookup.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Lookup])],
  controllers: [LookupsController],
  providers: [LookupsService],
  exports: [LookupsService, LookupsModule],
})
export class LookupsModule {}
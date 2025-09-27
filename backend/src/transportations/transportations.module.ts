import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TransportationsController } from './transportations.controller';
import { TransportationsService } from './transportations.service';
import { Transportation } from './transportation.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Transportation])],
  controllers: [TransportationsController],
  providers: [TransportationsService],
  exports: [TransportationsService],
})
export class TransportationsModule {}
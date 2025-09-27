import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TransportationItemsController } from './transportation-items.controller';
import { TransportationItemsService } from './transportation-items.service';
import { TransportationItem } from './transportation-item.entity';

@Module({
  imports: [TypeOrmModule.forFeature([TransportationItem])],
  controllers: [TransportationItemsController],
  providers: [TransportationItemsService],
  exports: [TransportationItemsService],
})
export class TransportationItemsModule {}
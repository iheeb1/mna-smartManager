import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { InventoryAdjustmentsController } from './inventory-adjustments.controller';
import { InventoryAdjustmentsService } from './inventory-adjustments.service';
import { InventoryAdjustment } from './inventory-adjustment.entity';

@Module({
  imports: [TypeOrmModule.forFeature([InventoryAdjustment])],
  controllers: [InventoryAdjustmentsController],
  providers: [InventoryAdjustmentsService],
  exports: [InventoryAdjustmentsService],
})
export class InventoryAdjustmentsModule {}
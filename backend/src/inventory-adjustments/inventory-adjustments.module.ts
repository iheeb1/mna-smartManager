import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { InventoryAdjustment } from './inventory-adjustment.entity';
import { InventoryAdjustmentController } from './inventory-adjustments.controller';
import { InventoryAdjustmentService } from './inventory-adjustments.service';

@Module({
  imports: [TypeOrmModule.forFeature([InventoryAdjustment])],
  controllers: [InventoryAdjustmentController],
  providers: [InventoryAdjustmentService],
  exports: [InventoryAdjustmentService],
})
export class InventoryAdjustmentModule {}
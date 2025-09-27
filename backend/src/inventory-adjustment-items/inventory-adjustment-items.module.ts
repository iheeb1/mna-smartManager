import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { InventoryAdjustmentItemsController } from './inventory-adjustment-items.controller';
import { InventoryAdjustmentItemsService } from './inventory-adjustment-items.service';
import { InventoryAdjustmentItem } from './inventory-adjustment-item.entity';

@Module({
  imports: [TypeOrmModule.forFeature([InventoryAdjustmentItem])],
  controllers: [InventoryAdjustmentItemsController],
  providers: [InventoryAdjustmentItemsService],
  exports: [InventoryAdjustmentItemsService],
})
export class InventoryAdjustmentItemsModule {}
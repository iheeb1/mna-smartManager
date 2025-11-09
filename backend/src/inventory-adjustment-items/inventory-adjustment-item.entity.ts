import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, Index, ManyToOne, JoinColumn } from 'typeorm';
import { InventoryAdjustment

 } from 'src/inventory-adjustments/inventory-adjustment.entity';
@Entity('mng_inventoryadjustmentitems')
@Index('FKIndex', ['adjustmentItemId', 'adjustmentId', 'productItemId', 'adjustmentItemStatusId'])
export class InventoryAdjustmentItem {
  @PrimaryGeneratedColumn({ name: 'AdjustmentItemId', unsigned: true })
  adjustmentItemId: number;

  @Column({ name: 'AdjustmentId', type: 'int', nullable: true, unsigned: true })
  adjustmentId: number;

  @Column({ name: 'ProductItemId', type: 'int', nullable: true })
  productItemId: number;

  @Column({ name: 'ProductItemCostTypeId', type: 'int', nullable: true })
  productItemCostTypeId: number;

  @Column({ name: 'ProductItemCost', type: 'decimal', precision: 20, scale: 2, nullable: true })
  productItemCost: number;

  @Column({ name: 'ProductItemAdjustedCost', type: 'decimal', precision: 20, scale: 2, nullable: true })
  productItemAdjustedCost: number;

  @Column({ name: 'ReferenceNumber', type: 'varchar', length: 100 })
  referenceNumber: string;

  @Column({ name: 'AdjustmentItemNewStockUnits', type: 'int', nullable: true })
  adjustmentItemNewStockUnits: number;

  @Column({ name: 'PalletsAmount', type: 'int', nullable: true })
  palletsAmount: number;

  @Column({ name: 'AdjustmentItemStatusId', type: 'int', nullable: true })
  adjustmentItemStatusId: number;

  @Column({ name: 'AdjustmentItemReasonId', type: 'int', nullable: true })
  adjustmentItemReasonId: number;

  @Column({ name: 'CreatedBy', type: 'int', nullable: true })
  createdBy: number;

  @Column({ name: 'ModifiedBy', type: 'int', nullable: true })
  modifiedBy: number;

  @CreateDateColumn({ name: 'CreatedDate', type: 'timestamp' })
  createdDate: Date;

  @UpdateDateColumn({ name: 'ModifiedDate', type: 'timestamp' })
  modifiedDate: Date;

  @ManyToOne(() => InventoryAdjustment, adjustment => adjustment.adjustmentItems)
  @JoinColumn({ name: 'AdjustmentId' })
  adjustment: InventoryAdjustment;
}
import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, Index, OneToMany } from 'typeorm';
import { InventoryAdjustmentItem } from 'src/inventory-adjustment-items/inventory-adjustment-item.entity';

@Entity('mng_inventoryadjustments')
@Index('FKIndex', ['adjustmentId', 'adjustmentDate', 'adjustmentStatusId', 'adjustmentTypeId'])
export class InventoryAdjustment {
  @PrimaryGeneratedColumn({ name: 'AdjustmentId', unsigned: true })
  adjustmentId: number;

  @CreateDateColumn({ name: 'AdjustmentDate', type: 'timestamp' })
  adjustmentDate: Date;

  @Column({ name: 'AdjustmentStatusId', type: 'int', nullable: true })
  adjustmentStatusId: number;

  @Column({ name: 'AdjustmentTypeId', type: 'int', nullable: true })
  adjustmentTypeId: number;

  @Column({ name: 'Description', type: 'longtext', nullable: true })
  description: string;

  @Column({ name: 'CreatedBy', type: 'int', nullable: true })
  createdBy: number;

  @Column({ name: 'ModifiedBy', type: 'int', nullable: true })
  modifiedBy: number;

  @CreateDateColumn({ name: 'CreatedDate', type: 'timestamp' })
  createdDate: Date;

  @UpdateDateColumn({ name: 'ModifiedDate', type: 'timestamp' })
  modifiedDate: Date;

  @OneToMany(() => InventoryAdjustmentItem, item => item.adjustment)
  adjustmentItems: InventoryAdjustmentItem[];
}
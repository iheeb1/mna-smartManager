import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, Index, OneToMany } from 'typeorm';
import { TransportationItem } from '../transportation-items/transportation-item.entity';

@Entity('mng_transportations')
@Index('FKIndex', ['driverId', 'transportationStatusId', 'transportationDate'])
export class Transportation {
  @PrimaryGeneratedColumn({ name: 'TransportationId', unsigned: true })
  transportationId: number;

  @Column({ name: 'DriverId', type: 'int', nullable: true })
  driverId: number;

  @Column({ name: 'TransportationStatusId', type: 'int', nullable: true })
  transportationStatusId: number;

  @Column({ name: 'TransportationNotes', type: 'varchar', length: 1000, nullable: true })
  transportationNotes: string;

  @Column({ name: 'TransportationDate', type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', nullable: true })
  transportationDate: Date;

  @Column({ name: 'CreatedBy', type: 'int', default: 1, nullable: true })
  createdBy: number;

  @Column({ name: 'ModifiedBy', type: 'int', default: 1, nullable: true })
  modifiedBy: number;

  @CreateDateColumn({ name: 'CreatedDate', type: 'timestamp' })
  createdDate: Date;

  @UpdateDateColumn({ name: 'ModifiedDate', type: 'timestamp' })
  modifiedDate: Date;

  @OneToMany(() => TransportationItem, (item) => item.transportation)
  transportationItems: TransportationItem[];
}
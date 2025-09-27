import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, Index } from 'typeorm';

@Entity('mng_transportations')
@Index('FKIndex', ['transportationId', 'driverId', 'transportationStatusId', 'transportationDate'])
export class Transportation {
  @PrimaryGeneratedColumn({ name: 'TransportationId', unsigned: true })
  transportationId: number;

  @Column({ name: 'DriverId', type: 'int', nullable: true })
  driverId: number;

  @Column({ name: 'TransportationStatusId', type: 'int', nullable: true })
  transportationStatusId: number;

  @Column({ name: 'TransportationNotes', type: 'varchar', length: 1000, nullable: true })
  transportationNotes: string;

  @CreateDateColumn({ name: 'TransportationDate', type: 'timestamp' })
  transportationDate: Date;

  @Column({ name: 'CreatedBy', type: 'int', default: 1, nullable: true })
  createdBy: number;

  @Column({ name: 'ModifiedBy', type: 'int', default: 1, nullable: true })
  modifiedBy: number;

  @CreateDateColumn({ name: 'CreatedDate', type: 'timestamp' })
  createdDate: Date;

  @UpdateDateColumn({ name: 'ModifiedDate', type: 'timestamp' })
  modifiedDate: Date;
}

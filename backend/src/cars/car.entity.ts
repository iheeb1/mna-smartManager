import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, Index } from 'typeorm';

@Entity('mng_cars')
@Index('FKIndex', ['carId', 'objectId', 'carStatusId', 'carNumber', 'createdDate'])
export class Car {
  @PrimaryGeneratedColumn({ name: 'CarId', unsigned: true })
  carId: number;

  @Column({ name: 'ObjectId', type: 'int', default: 0, nullable: true })
  objectId: number;

  @Column({ name: 'CarStatusId', type: 'int', default: 0, nullable: true })
  carStatusId: number;

  @Column({ name: 'CarNumber', type: 'varchar', length: 50, nullable: true })
  carNumber: string;

  @Column({ name: 'CarNotes', type: 'varchar', length: 1000, nullable: true })
  carNotes: string;

  @Column({ name: 'CreatedBy', type: 'int', default: 1, nullable: true })
  createdBy: number;

  @Column({ name: 'ModifiedBy', type: 'int', default: 1, nullable: true })
  modifiedBy: number;

  @CreateDateColumn({ name: 'CreatedDate', type: 'timestamp' })
  createdDate: Date;

  @UpdateDateColumn({ name: 'ModifiedDate', type: 'timestamp' })
  modifiedDate: Date;
}
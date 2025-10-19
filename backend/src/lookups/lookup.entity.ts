import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('mng_lookups')
export class Lookup {
  @PrimaryGeneratedColumn({ name: 'LookUpId', unsigned: true })
  lookUpId: number;

  @Column({ name: 'LookUpTableName', type: 'varchar', length: 100, nullable: true })
  lookUpTableName: string;

  @Column({ name: 'LookUpCode', type: 'varchar', length: 50, nullable: true })
  lookUpCode: string;

  @Column({ name: 'LookUpName', type: 'varchar', length: 255, nullable: true })
  lookUpName: string;

  @Column({ name: 'Param1', type: 'varchar', length: 255, nullable: true })
  param1: string;

  @Column({ name: 'Param2', type: 'varchar', length: 255, nullable: true })
  param2: string;

  @Column({ name: 'Param3', type: 'varchar', length: 255, nullable: true })
  param3: string;

  @Column({ name: 'LookUpStatus', type: 'int', default: 1, nullable: true })
  lookUpStatusId: number;

  @Column({ name: 'LookUpTypeId', type: 'int', default: 0, nullable: true })
  lookUpTypeId: number;

  @Column({ name: 'LookUpTypeName', type: 'varchar', length: 100, nullable: true })
  lookUpTypeName: string;

  @Column({ name: 'LookUpData', type: 'text', nullable: true })
  lookUpData: string;

  @Column({ name: 'CreatedById', type: 'int', default: 1, nullable: true })
  createdBy: number;

  @Column({ name: 'ModifiedById', type: 'int', default: 1, nullable: true })
  modifiedBy: number;

  @CreateDateColumn({ name: 'CreatedDate', type: 'timestamp' })
  createdDate: Date;

  @UpdateDateColumn({ name: 'UpdatedDate', type: 'timestamp' })
  modifiedDate: Date;
}
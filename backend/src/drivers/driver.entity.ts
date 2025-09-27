import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, Index } from 'typeorm';

@Entity('mng_drivers')
@Index('FKIndex', ['driverId', 'driverParentId', 'driverStatusId', 'driverTypeId', 'createdDate'])
export class Driver {
  @PrimaryGeneratedColumn({ name: 'DriverId', unsigned: true })
  driverId: number;

  @Column({ name: 'DriverParentId', type: 'int', default: 0, nullable: true })
  driverParentId: number;

  @Column({ name: 'DriverStatusId', type: 'int', default: 0, nullable: true })
  driverStatusId: number;

  @Column({ name: 'DriverTypeId', type: 'int', nullable: true })
  driverTypeId: number;

  @Column({ name: 'DriverIdz', type: 'varchar', length: 50, nullable: true })
  @Index()
  driverIdz: string;

  @Column({ name: 'CarNumber', type: 'varchar', length: 50, nullable: true })
  @Index()
  carNumber: string;

  @Column({ name: 'DriverName', type: 'varchar', length: 500, nullable: true })
  driverName: string;

  @Column({ name: 'DriverNotes', type: 'varchar', length: 1000, nullable: true })
  driverNotes: string;

  @Column({ name: 'DriverProfileImage', type: 'varchar', length: 200, nullable: true })
  driverProfileImage: string;

  @Column({ name: 'DriverEmails', type: 'varchar', length: 500, nullable: true })
  driverEmails: string;

  @Column({ name: 'DriverPhoneNumber', type: 'varchar', length: 20, nullable: true })
  driverPhoneNumber: string;

  @Column({ name: 'DriverMobileNumber', type: 'varchar', length: 20, nullable: true })
  driverMobileNumber: string;

  @Column({ name: 'DriverFaxNumber', type: 'varchar', length: 20, nullable: true })
  driverFaxNumber: string;

  @Column({ name: 'DriverAddressLine1', type: 'varchar', length: 100, nullable: true })
  driverAddressLine1: string;

  @Column({ name: 'DriverAddressLine2', type: 'varchar', length: 100, nullable: true })
  driverAddressLine2: string;

  @Column({ name: 'DriverCity', type: 'varchar', length: 50, nullable: true })
  driverCity: string;

  @Column({ name: 'DriverState', type: 'varchar', length: 50, nullable: true })
  driverState: string;

  @Column({ name: 'DriverZIP', type: 'varchar', length: 50, nullable: true })
  driverZIP: string;

  @Column({ name: 'DriverCountry', type: 'varchar', length: 50, nullable: true })
  @Index()
  driverCountry: string;

  @Column({ name: 'CreatedBy', type: 'int', default: 1, nullable: true })
  createdBy: number;

  @Column({ name: 'ModifiedBy', type: 'int', default: 1, nullable: true })
  modifiedBy: number;

  @CreateDateColumn({ name: 'CreatedDate', type: 'timestamp' })
  createdDate: Date;

  @UpdateDateColumn({ name: 'ModifiedDate', type: 'timestamp' })
  modifiedDate: Date;
}
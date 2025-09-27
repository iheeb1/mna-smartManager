import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, Index } from 'typeorm';

@Entity('mng_agents')
@Index('FKIndex', ['customerId', 'customerStatusId', 'customerTypeId', 'createdDate'])
export class Agent {
  @PrimaryGeneratedColumn({ name: 'CustomerId', unsigned: true })
  customerId: number;

  @Column({ name: 'CustomerParentId', type: 'int', default: -1, nullable: true })
  customerParentId: number;

  @Column({ name: 'CustomerStatusId', type: 'int', default: 0, nullable: true })
  customerStatusId: number;

  @Column({ name: 'CustomerTypeId', type: 'int', nullable: true })
  customerTypeId: number;

  @Column({ name: 'CustomerIdz', type: 'varchar', length: 50, nullable: true })
  @Index()
  customerIdz: string;

  @Column({ name: 'CustomerName', type: 'varchar', length: 500, nullable: true })
  customerName: string;

  @Column({ name: 'CustomerOpeningBalance', type: 'decimal', precision: 20, scale: 2, nullable: true })
  customerOpeningBalance: number;

  @Column({ name: 'CustomerNotes', type: 'varchar', length: 1000, nullable: true })
  customerNotes: string;

  @Column({ name: 'CustomerProfileImage', type: 'varchar', length: 200, nullable: true })
  customerProfileImage: string;

  @Column({ name: 'CustomerEmails', type: 'varchar', length: 500, nullable: true })
  customerEmails: string;

  @Column({ name: 'CustomerPhoneNumber', type: 'varchar', length: 20, nullable: true })
  customerPhoneNumber: string;

  @Column({ name: 'CustomerMobileNumber', type: 'varchar', length: 20, nullable: true })
  customerMobileNumber: string;

  @Column({ name: 'CustomerFaxNumber', type: 'varchar', length: 20, nullable: true })
  customerFaxNumber: string;

  @Column({ name: 'CustomerAddressLine1', type: 'varchar', length: 100, nullable: true })
  customerAddressLine1: string;

  @Column({ name: 'CustomerAddressLine2', type: 'varchar', length: 100, nullable: true })
  customerAddressLine2: string;

  @Column({ name: 'CustomerCity', type: 'varchar', length: 50, nullable: true })
  customerCity: string;

  @Column({ name: 'CustomerState', type: 'varchar', length: 50, nullable: true })
  customerState: string;

  @Column({ name: 'CustomerZIP', type: 'varchar', length: 50, nullable: true })
  customerZIP: string;

  @Column({ name: 'CustomerCountry', type: 'varchar', length: 50, nullable: true })
  @Index()
  customerCountry: string;

  @Column({ name: 'CreatedBy', type: 'int', default: 1, nullable: true })
  createdBy: number;

  @Column({ name: 'ModifiedBy', type: 'int', default: 1, nullable: true })
  modifiedBy: number;

  @CreateDateColumn({ name: 'CreatedDate', type: 'timestamp' })
  createdDate: Date;

  @UpdateDateColumn({ name: 'ModifiedDate', type: 'timestamp' })
  modifiedDate: Date;
}
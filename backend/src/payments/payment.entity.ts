import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, Index } from 'typeorm';

@Entity('mng_payments')
@Index('FKIndex', ['paymentId', 'customerId', 'paymentTypeId', 'paymentStatusId', 'paymentDate'])
export class Payment {
  @PrimaryGeneratedColumn({ name: 'PaymentId', unsigned: true })
  paymentId: number;

  @Column({ name: 'CustomerId', type: 'int', nullable: true })
  customerId: number;

  @Column({ name: 'PaymentTypeId', type: 'int', nullable: true })
  paymentTypeId: number;

  @Column({ name: 'PaymentDiscount', type: 'decimal', precision: 20, scale: 2, nullable: true })
  paymentDiscount: number;

  @Column({ name: 'PaymentStatusId', type: 'int', default: 1, nullable: true })
  paymentStatusId: number;

  @Column({ name: 'PaymentNotes', type: 'varchar', length: 1000, nullable: true })
  paymentNotes: string;

  @Column({ name: 'PaymentDate', type: 'datetime', default: () => 'CURRENT_TIMESTAMP', nullable: true })
  paymentDate: Date;

  @Column({ name: 'CreatedBy', type: 'int', default: 1, nullable: true })
  createdBy: number;

  @Column({ name: 'ModifiedBy', type: 'int', default: 1, nullable: true })
  modifiedBy: number;

  @CreateDateColumn({ name: 'CreatedDate', type: 'timestamp' })
  createdDate: Date;

  @UpdateDateColumn({ name: 'ModifiedDate', type: 'timestamp' })
  modifiedDate: Date;
}
import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, Index, ManyToOne, JoinColumn } from 'typeorm';
import { Payment } from '../payments/payment.entity';

@Entity('mng_paymentitems')
@Index('FKIndex', ['paymentId', 'paymentItemMethodId', 'paymentItemStatusId'])
export class PaymentItem {
  @PrimaryGeneratedColumn({ name: 'PaymentItemId', unsigned: true })
  paymentItemId: number;

  @Column({ name: 'PaymentId', type: 'int', unsigned: true, nullable: true })
  paymentId: number;

  @Column({ name: 'PaymentItemMethodId', type: 'int', nullable: true })
  paymentItemMethodId: number;

  @Column({ name: 'PaymentItemBankId', type: 'int', nullable: true })
  paymentItemBankId: number;

  @Column({ name: 'PaymentItemBankAccountNumber', type: 'varchar', length: 20, nullable: true })
  paymentItemBankAccountNumber: string;

  @Column({ name: 'PaymentItemBankBranchNumber', type: 'varchar', length: 20, nullable: true })
  paymentItemBankBranchNumber: string;

  @Column({ name: 'PaymentItemAmount', type: 'decimal', precision: 20, scale: 2, nullable: true })
  paymentItemAmount: number;

  @Column({ name: 'PaymentItemCheckNumber', type: 'varchar', length: 20, nullable: true })
  paymentItemCheckNumber: string;

  @Column({ name: 'PaymentItemNameOnCheck', type: 'varchar', length: 500, nullable: true })
  paymentItemNameOnCheck: string;

  @Column({ name: 'PaymentItemCheckDueDate', type: 'datetime', default: () => 'CURRENT_TIMESTAMP', nullable: true })
  paymentItemCheckDueDate: Date;

  @Column({ name: 'PaymentItemReference', type: 'varchar', length: 45, nullable: true })
  paymentItemReference: string;

  @Column({ name: 'PaymentItemCheckStatusId', type: 'int', nullable: true })
  paymentItemCheckStatusId: number;

  @Column({ name: 'PaymentItemStatusId', type: 'int', nullable: true })
  paymentItemStatusId: number;

  @Column({ name: 'PaymentItemNotes', type: 'varchar', length: 1000, nullable: true })
  paymentItemNotes: string;

  @Column({ name: 'CreatedBy', type: 'int', default: 1, nullable: true })
  createdBy: number;

  @Column({ name: 'ModifiedBy', type: 'int', default: 1, nullable: true })
  modifiedBy: number;

  @CreateDateColumn({ name: 'CreatedDate', type: 'timestamp' })
  createdDate: Date;

  @UpdateDateColumn({ name: 'ModifiedDate', type: 'timestamp' })
  modifiedDate: Date;

  @ManyToOne(() => Payment, (payment) => payment.paymentItems)
  @JoinColumn({ name: 'PaymentId' })
  payment: Payment;
}
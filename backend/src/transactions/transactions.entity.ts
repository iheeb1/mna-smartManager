import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn, UpdateDateColumn, Index } from 'typeorm';
import { Customer } from 'src/customers/entities/customer.entity';
import { Car } from 'src/cars/car.entity';

export enum TransactionType {
  ORDER = 'Order',
  PAYMENT = 'Payment',
  ORDER_DETAILED = 'OrderDetailed',
  PAYMENT_DETAILED = 'PaymentDetailed'
}

@Entity('mng_transactions')
@Index('FKIndex', ['transactionId', 'customerId', 'carId', 'transactionDate', 'transactionType'])
export class Transaction {
  @PrimaryGeneratedColumn({ name: 'TransactionId', unsigned: true })
  transactionId: number;

  @Column({ name: 'CustomerId', type: 'int', unsigned: true })
  customerId: number;

  @ManyToOne(() => Customer, { eager: true })
  @JoinColumn({ name: 'CustomerId' })
  customer: Customer;

  @Column({ name: 'CarId', type: 'int', unsigned: true, nullable: true })
  carId: number;

  @ManyToOne(() => Car, { eager: true, nullable: true })
  @JoinColumn({ name: 'CarId' })
  car: Car;

  @Column({ name: 'TransactionDate', type: 'datetime' })
  transactionDate: Date;

  @Column({
    name: 'TransactionType',
    type: 'enum',
    enum: TransactionType,
    default: TransactionType.ORDER
  })
  transactionType: TransactionType;

  @Column({ name: 'ReferenceId', type: 'int', unsigned: true, nullable: true })
  referenceId: number;

  @Column({ name: 'TransactionOrderAmount', type: 'decimal', precision: 20, scale: 2, default: 0 })
  transactionOrderAmount: number;

  @Column({ name: 'TransactionPaymentAmount', type: 'decimal', precision: 20, scale: 2, default: 0 })
  transactionPaymentAmount: number;

  @Column({ name: 'TransactionTotal', type: 'decimal', precision: 20, scale: 2, default: 0 })
  transactionTotal: number;

  @Column({ name: 'TransactionData', type: 'json', nullable: true })
  transactionData: any;

  @Column({ name: 'CreatedBy', type: 'int', unsigned: true, default: 1, nullable: true })
  createdBy: number;

  @Column({ name: 'ModifiedBy', type: 'int', unsigned: true, default: 1, nullable: true })
  modifiedBy: number;

  @CreateDateColumn({ name: 'CreatedDate', type: 'timestamp' })
  createdDate: Date;

  @UpdateDateColumn({ name: 'ModifiedDate', type: 'timestamp' })
  modifiedDate: Date;
}
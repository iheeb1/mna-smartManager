import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, Index } from 'typeorm';

@Entity('mng_orders')
@Index('FKIndex', ['orderId', 'customerId', 'orderStatusId', 'orderDate'])
export class Order {
  @PrimaryGeneratedColumn({ name: 'OrderId', unsigned: true })
  orderId: number;

  @Column({ name: 'CustomerId', type: 'int', nullable: true })
  customerId: number;

  @Column({ name: 'DriverId', type: 'int', nullable: true })
  driverId: number;

  @Column({ name: 'OrderTypeId', type: 'int', nullable: true })
  orderTypeId: number;

  @Column({ name: 'OrderUnitsNumber', type: 'decimal', precision: 20, scale: 2, nullable: true })
  orderUnitsNumber: number;

  @Column({ name: 'OrderPrice', type: 'decimal', precision: 20, scale: 2, nullable: true })
  orderPrice: number;

  @Column({ name: 'OrderVat', type: 'decimal', precision: 20, scale: 2, nullable: true })
  orderVat: number;

  @Column({ name: 'OrderIncludeVat', type: 'int', default: 1, nullable: true })
  orderIncludeVat: number;

  @Column({ name: 'OrderTotalPriceWithOutVat', type: 'decimal', precision: 20, scale: 2, nullable: true })
  orderTotalPriceWithOutVat: number;

  @Column({ name: 'OrderTotalPriceVat', type: 'decimal', precision: 20, scale: 2, nullable: true })
  orderTotalPriceVat: number;

  @Column({ name: 'OrderTotalPriceWithVat', type: 'decimal', precision: 20, scale: 2, nullable: true })
  orderTotalPriceWithVat: number;

  @Column({ name: 'OrderTotalCost', type: 'decimal', precision: 20, scale: 2, nullable: true })
  orderTotalCost: number;

  @Column({ name: 'OrderStatusId', type: 'int', nullable: true })
  orderStatusId: number;

  @Column({ name: 'ShippingCertificateId', type: 'varchar', length: 50, nullable: true })
  shippingCertificateId: string;

  @Column({ name: 'Meters', type: 'int', nullable: true })
  meters: number;

  @Column({ name: 'Cubes', type: 'int', nullable: true })
  cubes: number;

  @Column({ name: 'FromLocationId', type: 'int', nullable: true })
  fromLocationId: number;

  @Column({ name: 'ToLocationId', type: 'int', nullable: true })
  toLocationId: number;

  // FIXED: Reduced from 500 to 255 characters
  @Column({ name: 'LocationAddress', type: 'varchar', length: 255, nullable: true })
  locationAddress: string;

  @Column({ name: 'OrderNotes', type: 'varchar', length: 1000, nullable: true })
  orderNotes: string;

  @Column({ name: 'OrderDate', type: 'datetime', default: () => 'CURRENT_TIMESTAMP', nullable: true })
  orderDate: Date;

  @Column({ name: 'EvacuationTime', type: 'int', default: 0, nullable: true })
  evacuationTime: number;

  @Column({ name: 'ConversionDate', type: 'datetime', nullable: true })
  conversionDate: Date;

  @Column({ name: 'CreatedBy', type: 'int', default: 1, nullable: true })
  createdBy: number;

  @Column({ name: 'ModifiedBy', type: 'int', default: 1, nullable: true })
  modifiedBy: number;

  @CreateDateColumn({ name: 'CreatedDate', type: 'timestamp' })
  createdDate: Date;

  @UpdateDateColumn({ name: 'ModifiedDate', type: 'timestamp' })
  modifiedDate: Date;
}
import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, Index, Unique } from 'typeorm';

@Entity('mng_products')
@Index('FKIndex', ['productId', 'categoryId', 'productStatusId', 'createdDate'])
export class Product {
  @PrimaryGeneratedColumn({ name: 'ProductId', unsigned: true })
  productId: number;

  @Column({ name: 'ProductCode', type: 'varchar', length: 255 })
  @Unique('ProductCode_UNIQUE', ['productCode'])
  @Index()
  productCode: string;

  @Column({ name: 'ProductName', type: 'varchar', length: 255, nullable: true })
  productName: string;

  @Column({ name: 'CategoryId', type: 'int', nullable: true })
  categoryId: number;

  @Column({ name: 'ProductSize', type: 'varchar', length: 255, nullable: true })
  productSize: string;

  @Column({ name: 'ManufacturerId', type: 'int', nullable: true })
  manufacturerId: number;

  @Column({ name: 'BrandId', type: 'int', nullable: true })
  brandId: number;

  @Column({ name: 'ProductPrice', type: 'decimal', precision: 20, scale: 2, nullable: true })
  productPrice: number;

  @Column({ name: 'ProductImage', type: 'varchar', length: 500, nullable: true })
  productImage: string;

  @Column({ name: 'ReturnableItem', type: 'int', default: 1, nullable: true })
  returnableItem: number;

  @Column({ name: 'IncludeVariants', type: 'int', default: 1, nullable: true })
  includeVariants: number;

  @Column({ name: 'ProductVariants', type: 'longtext', nullable: true })
  productVariants: string;

  @Column({ name: 'ProductStatusId', type: 'int', default: 1, nullable: true })
  productStatusId: number;

  @Column({ name: 'CreatedBy', type: 'int', default: 1, nullable: true })
  createdBy: number;

  @Column({ name: 'ModifiedBy', type: 'int', default: 1, nullable: true })
  modifiedBy: number;

  @CreateDateColumn({ name: 'CreatedDate', type: 'timestamp' })
  createdDate: Date;

  @UpdateDateColumn({ name: 'ModifiedDate', type: 'timestamp' })
  modifiedDate: Date;
}
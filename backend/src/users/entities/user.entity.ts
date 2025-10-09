import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn({ name: 'UserId' })
  userId: number;

  @Column({ name: 'UserStatus', default: -1 })
  userStatus: number;

  @Column({ name: 'UserType', default: -1 })
  userType: number;

  @Column({ name: 'FullName', type: 'varchar', length: 255, nullable: true })
  fullName: string;

  @Column({ name: 'UserName', type: 'varchar', length: 100, unique: true })
  userName: string;

  @Column({ name: 'Password', type: 'varchar', length: 255, select: false })
  password: string;

  @Column({ name: 'PhoneNumber', type: 'varchar', length: 50, nullable: true })
  phoneNumber: string;

  @Column({ name: 'MobileNumber', type: 'varchar', length: 50, nullable: true })
  mobileNumber: string;

  @Column({ name: 'FaxNumber', type: 'varchar', length: 50, nullable: true })
  faxNumber: string;

  @Column({ name: 'AddressLine1', type: 'varchar', length: 255, nullable: true })
  addressLine1: string;

  @Column({ name: 'AddressLine2', type: 'varchar', length: 255, nullable: true })
  addressLine2: string;

  @Column({ name: 'City', type: 'varchar', length: 100, nullable: true })
  city: string;

  @Column({ name: 'State', type: 'varchar', length: 100, nullable: true })
  state: string;

  @Column({ name: 'ZIP', type: 'varchar', length: 20, nullable: true })
  zip: string;

  @Column({ name: 'Country', type: 'varchar', length: 100, nullable: true })
  country: string;

  @Column({ name: 'ProfileImage', type: 'text', nullable: true })
  profileImage: string;

  @Column({ name: 'ResetGuId', type: 'varchar', length: 255, nullable: true })
  resetGuId: string;

  @Column({ name: 'CreatedBy', default: -1 })
  createdBy: number;

  @Column({ name: 'ModifiedBy', default: -1 })
  modifiedBy: number;

  @CreateDateColumn({ name: 'CreatedDate' })
  createdDate: Date;

  @UpdateDateColumn({ name: 'ModifiedDate' })
  modifiedDate: Date;

  // Transient property for token (not stored in DB)
  token?: string;
}
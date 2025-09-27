import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, Index } from 'typeorm';

@Entity('mng_backups')
@Index('FKIndex', ['backupId', 'createdBy', 'createdDate'])
export class Backup {
  @PrimaryGeneratedColumn({ name: 'BackupId', unsigned: true })
  backupId: number;

  @Column({ name: 'BackupPath', type: 'varchar', length: 500, nullable: true })
  backupPath: string;

  @Column({ name: 'BackupNotes', type: 'varchar', length: 1000, nullable: true })
  backupNotes: string;

  @Column({ name: 'CreatedBy', type: 'int', default: 1, nullable: true })
  createdBy: number;

  @Column({ name: 'ModifiedBy', type: 'int', default: 1, nullable: true })
  modifiedBy: number;

  @CreateDateColumn({ name: 'CreatedDate', type: 'timestamp' })
  createdDate: Date;

  @UpdateDateColumn({ name: 'ModifiedDate', type: 'timestamp' })
  modifiedDate: Date;

  @Column({ name: 'CanDelete', type: 'bit', default: () => "b'0'", nullable: true })
  canDelete: boolean;
}
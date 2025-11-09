import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Brackets } from 'typeorm';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { Backup } from './backup.entity';
import { GetBackupsQueryDto } from './dto/backup.dto';
import * as path from 'path';
import * as fs from 'fs/promises';

@Injectable()
export class BackupService {
  constructor(
    @InjectRepository(Backup)
    private readonly backupRepository: Repository<Backup>,
    @InjectDataSource()
    private readonly dataSource: DataSource,
  ) {}

  async executeBackup(createdById: number): Promise<Backup | null> {
    const filePath = await this.performDatabaseBackup();
    
    if (!filePath || filePath.trim() === '') {
      return null;
    }

    const backup = this.backupRepository.create({
      backupPath: filePath.trim(),
      createdBy: createdById,
    });

    return this.backupRepository.save(backup);
  }

  async getBackupsTable(query: GetBackupsQueryDto): Promise<any[]> {
    const qb = this.buildQuery(query);
    
    const itemsPerPage = query.itemsPerPage || 30;
    const pageNumber = query.pageNumber || 0;
    
    if (itemsPerPage > 0) {
      qb.take(itemsPerPage);
      qb.skip(pageNumber * itemsPerPage);
    }

    return qb.getRawMany();
  }

  async getBackupsList(query: GetBackupsQueryDto): Promise<Backup[]> {
    const qb = this.buildQuery(query);
    
    const itemsPerPage = query.itemsPerPage || 30;
    const pageNumber = query.pageNumber || 0;
    
    if (itemsPerPage > 0) {
      qb.take(itemsPerPage);
      qb.skip(pageNumber * itemsPerPage);
    }

    return qb.getMany();
  }

  async getBackupsTotalRowsCount(query: GetBackupsQueryDto): Promise<number> {
    const qb = this.buildQuery(query);
    return qb.getCount();
  }

  async getBackupDetails(backupId: number): Promise<Backup | null> {
    const backupsList = await this.getBackupsList({ 
      backupIds: backupId.toString(),
      itemsPerPage: 30,
      pageNumber: 0 
    });

    if (backupsList && backupsList.length > 0) {
      return backupsList[0];
    }

    return null;
  }

  async deleteBackup(backupId: number): Promise<void> {
    await this.backupRepository.delete(backupId);
  }

  async save(backup: Partial<Backup>): Promise<Backup | null> {
    if (backup.backupId) {
      await this.backupRepository.update(backup.backupId, backup);
      return this.backupRepository.findOne({ where: { backupId: backup.backupId } });
    }
    
    const newBackup = this.backupRepository.create(backup);
    return this.backupRepository.save(newBackup);
  }

  private buildQuery(query: GetBackupsQueryDto) {
    const qb = this.backupRepository.createQueryBuilder('backup');

    if (query.backupIds) {
      const ids = this.parseIds(query.backupIds);
      if (ids.length > 0) {
        qb.andWhere('backup.backupId IN (:...backupIds)', { backupIds: ids });
      }
    }

    if (query.createdByIds) {
      const ids = this.parseIds(query.createdByIds);
      if (ids.length > 0) {
        qb.andWhere('backup.createdBy IN (:...createdByIds)', { createdByIds: ids });
      }
    }

    if (query.modifiedByIds) {
      const ids = this.parseIds(query.modifiedByIds);
      if (ids.length > 0) {
        qb.andWhere('backup.modifiedBy IN (:...modifiedByIds)', { modifiedByIds: ids });
      }
    }

    if (query.fromCreatedDate) {
      qb.andWhere('backup.createdDate >= :fromCreatedDate', {
        fromCreatedDate: query.fromCreatedDate,
      });
    }

    if (query.toCreatedDate) {
      qb.andWhere('backup.createdDate <= :toCreatedDate', {
        toCreatedDate: query.toCreatedDate,
      });
    }

    if (query.fromModifiedDate) {
      qb.andWhere('backup.modifiedDate >= :fromModifiedDate', {
        fromModifiedDate: query.fromModifiedDate,
      });
    }

    if (query.toModifiedDate) {
      qb.andWhere('backup.modifiedDate <= :toModifiedDate', {
        toModifiedDate: query.toModifiedDate,
      });
    }

    qb.orderBy('backup.createdDate', 'DESC');

    return qb;
  }

  private parseIds(idsString: string): number[] {
    return idsString
      .split(',')
      .map(id => parseInt(id.trim(), 10))
      .filter(id => !isNaN(id));
  }

  private async performDatabaseBackup(): Promise<string> {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const backupDir = process.env.BACKUP_DIR || './backups';
    const fileName = `backup_${timestamp}.sql`;
    const filePath = path.join(backupDir, fileName);

    try {
      await fs.mkdir(backupDir, { recursive: true });

      const tables = await this.dataSource.query('SHOW TABLES');
      let sqlDump = '';

      for (const tableObj of tables) {
        const tableName = Object.values(tableObj)[0] as string;
        
        const [createTableResult] = await this.dataSource.query(`SHOW CREATE TABLE \`${tableName}\``);
        sqlDump += `\n\nDROP TABLE IF EXISTS \`${tableName}\`;\n`;
        sqlDump += createTableResult['Create Table'] + ';\n';

        const rows = await this.dataSource.query(`SELECT * FROM \`${tableName}\``);
        
        if (rows.length > 0) {
          for (const row of rows) {
            const values = Object.values(row).map(val => {
              if (val === null) return 'NULL';
              if (typeof val === 'string') return `'${val.replace(/'/g, "''")}'`;
              if (val instanceof Date) return `'${val.toISOString()}'`;
              return val;
            }).join(', ');
            
            sqlDump += `INSERT INTO \`${tableName}\` VALUES (${values});\n`;
          }
        }
      }

      await fs.writeFile(filePath, sqlDump, 'utf-8');

      return filePath;
    } catch (error) {
      console.error('Backup failed:', error);
      return '';
    }
  }
}
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BackupController } from './backups.controller';
import { BackupService } from './backups.service';
import { Backup } from './backup.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Backup])],
  controllers: [BackupController],
  providers: [BackupService],
  exports: [BackupService],
})
export class BackupsModule {}
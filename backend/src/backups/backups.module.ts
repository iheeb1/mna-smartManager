import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BackupsController } from './backups.controller';
import { BackupsService } from './backups.service';
import { Backup } from './backup.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Backup])],
  controllers: [BackupsController],
  providers: [BackupsService],
  exports: [BackupsService],
})
export class BackupsModule {}
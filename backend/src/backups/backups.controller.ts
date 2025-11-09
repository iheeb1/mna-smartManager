import { Controller, Get, Post, Delete, Body, Param, Query, ParseIntPipe, HttpCode, HttpStatus } from '@nestjs/common';
import { BackupService } from './backups.service';
import { ExecuteBackupDto, GetBackupsQueryDto } from './dto/backup.dto';

@Controller('backups')
export class BackupController {
  constructor(private readonly backupService: BackupService) {}

  @Post('execute')
  @HttpCode(HttpStatus.CREATED)
  async executeBackup(@Body() dto: ExecuteBackupDto) {
    return this.backupService.executeBackup(dto.createdById);
  }

  @Get()
  async getBackupsList(@Query() query: GetBackupsQueryDto) {
    return this.backupService.getBackupsList(query);
  }

  @Get('table')
  async getBackupsTable(@Query() query: GetBackupsQueryDto) {
    return this.backupService.getBackupsTable(query);
  }

  @Get('count')
  async getBackupsCount(@Query() query: GetBackupsQueryDto) {
    const count = await this.backupService.getBackupsTotalRowsCount(query);
    return { count };
  }

  @Get(':id')
  async getBackupDetails(@Param('id', ParseIntPipe) id: number) {
    return this.backupService.getBackupDetails(id);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteBackup(@Param('id', ParseIntPipe) id: number) {
    await this.backupService.deleteBackup(id);
  }
}
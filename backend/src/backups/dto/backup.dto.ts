import { IsString, IsOptional, IsInt, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class GetBackupsQueryDto {
  @IsOptional()
  @IsString()
  backupIds?: string;

  @IsOptional()
  @IsString()
  createdByIds?: string;

  @IsOptional()
  @IsString()
  modifiedByIds?: string;

  @IsOptional()
  @IsString()
  fromCreatedDate?: string;

  @IsOptional()
  @IsString()
  toCreatedDate?: string;

  @IsOptional()
  @IsString()
  fromModifiedDate?: string;

  @IsOptional()
  @IsString()
  toModifiedDate?: string;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  itemsPerPage?: number = 30;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  pageNumber?: number = 0;
}

export class ExecuteBackupDto {
  @IsInt()
  createdById: number;
}
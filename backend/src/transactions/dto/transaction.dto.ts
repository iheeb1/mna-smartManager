import { IsOptional, IsString, IsInt, IsBoolean, IsEnum, Min } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export enum GroupByType {
  DATE = 'Date',
  CUSTOMER = 'Customer',
  TRANSACTION_TYPE = 'TransactionType',
  NONE = ''
}

export class TransactionSearchDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsInt()
  @Type(() => Number)
  customerId?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  carCarNumber?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  fromDate?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  toDate?: string;

  @ApiPropertyOptional({ default: 30 })
  @IsOptional()
  @IsInt()
  @Min(1)
  @Type(() => Number)
  itemsPerPage?: number = 30;

  @ApiPropertyOptional({ default: 0 })
  @IsOptional()
  @IsInt()
  @Min(0)
  @Type(() => Number)
  pageNumber?: number = 0;

  @ApiPropertyOptional({ default: false })
  @IsOptional()
  @IsBoolean()
  includeItems?: boolean = false;

  @ApiPropertyOptional({ enum: GroupByType, default: GroupByType.NONE })
  @IsOptional()
  @IsEnum(GroupByType)
  groupBy?: GroupByType = GroupByType.NONE;
}

export class TransactionRequestDto {
  @ApiProperty({ enum: ['GetGroupedTransactionsList', 'GetDetailedTransactionsList'] })
  @IsString()
  reqType: string;

  @ApiProperty({ type: TransactionSearchDto })
  @Type(() => TransactionSearchDto)
  reqObject: TransactionSearchDto;
}

export class TransactionResponseDto {
  transactionId: number;
  customerId: number;
  customerName: string;
  carNumber?: string;
  transactionDate: string;
  shortDate: string;
  transactionType: string;
  transactionTypeId: number;
  transactionOrderAmount: number;
  transactionPaymentAmount: number;
  transactionTotal: number;
  transactionData?: any;
}

export class GroupedTransactionResponseDto {
  item: string | number;
  subList: TransactionResponseDto[];
}

export class TransactionListResponseDto {
  totalLength: number;
  rowsList: TransactionResponseDto[] | GroupedTransactionResponseDto[];
}

export class ApiResponseDto<T = any> {
  success: boolean;
  code: number;
  message: string;
  data: T;

  constructor(success: boolean, code: number, message: string, data: T) {
    this.success = success;
    this.code = code;
    this.message = message;
    this.data = data;
  }
}
import { IsString, IsNotEmpty, IsObject, ValidateNested, IsOptional, IsInt, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class TotalsLayoutCustomerDto {
  @IsOptional()
  @IsString()
  CustomerIds?: string;
}

export class TotalsLayoutDateDto {
  @IsOptional()
  @IsString()
  FromDate?: string;

  @IsOptional()
  @IsString()
  ToDate?: string;
}

export class DashboardReqObjectDto {
  @IsOptional()
  @ValidateNested()
  @Type(() => TotalsLayoutCustomerDto)
  TotalsLayoutCustomer?: TotalsLayoutCustomerDto;

  @IsOptional()
  @ValidateNested()
  @Type(() => TotalsLayoutDateDto)
  TotalsLayoutDate?: TotalsLayoutDateDto;
}

export class DashboardRequestDto {
  @IsNotEmpty()
  @IsString()
  ReqType: string;

  @IsNotEmpty()
  @IsObject()
  @ValidateNested()
  @Type(() => DashboardReqObjectDto)
  ReqObject: DashboardReqObjectDto;
}

export class ClearedChecksQueryDto {
  @IsOptional()
  @IsString()
  customerIds?: string;

  @IsOptional()
  @IsString()
  fromDate?: string;

  @IsOptional()
  @IsString()
  toDate?: string;

  @IsOptional()
  @IsString()
  paymentItemMethodIds?: string;

  @IsOptional()
  @IsString()
  paymentItemCheckStatusIds?: string;

  @IsOptional()
  @IsString()
  paymentItemBankIds?: string;

  @IsOptional()
  @IsString()
  fromPaymentItemCheckDueDate?: string;

  @IsOptional()
  @IsString()
  toPaymentItemCheckDueDate?: string;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  itemsPerPage?: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  pageNumber?: number;
}

export class AlertsClaimsQueryDto {
  @IsOptional()
  @IsString()
  customerIds?: string;

  @IsOptional()
  @IsString()
  fromDate?: string;

  @IsOptional()
  @IsString()
  toDate?: string;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  itemsPerPage?: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  pageNumber?: number;
}

export class SystemBackupsQueryDto {
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  itemsPerPage?: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  pageNumber?: number;
}
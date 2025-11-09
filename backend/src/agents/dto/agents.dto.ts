import { IsString, IsOptional, IsInt, IsNumber, IsBoolean, ValidateNested, Min } from 'class-validator';
import { Type } from 'class-transformer';

// Base request DTO
export class AgentRequestDto {
  @IsString()
  ReqType: string;

  @IsOptional()
  ReqObject?: any;
}

// Save Agent DTO
export class SaveAgentDto {
  @IsOptional()
  @IsInt()
  customerId?: number;

  @IsOptional()
  @IsInt()
  customerParentId?: number;

  @IsOptional()
  @IsInt()
  customerStatusId?: number;

  @IsOptional()
  @IsInt()
  customerTypeId?: number;

  @IsOptional()
  @IsString()
  customerIdz?: string;

  @IsOptional()
  @IsString()
  customerName?: string;

  @IsOptional()
  @IsNumber()
  customerOpeningBalance?: number;

  @IsOptional()
  @IsString()
  customerNotes?: string;

  @IsOptional()
  @IsString()
  customerProfileImage?: string;

  @IsOptional()
  @IsString()
  customerEmails?: string;

  @IsOptional()
  @IsString()
  customerPhoneNumber?: string;

  @IsOptional()
  @IsString()
  customerMobileNumber?: string;

  @IsOptional()
  @IsString()
  customerFaxNumber?: string;

  @IsOptional()
  @IsString()
  customerAddressLine1?: string;

  @IsOptional()
  @IsString()
  customerAddressLine2?: string;

  @IsOptional()
  @IsString()
  customerCity?: string;

  @IsOptional()
  @IsString()
  customerState?: string;

  @IsOptional()
  @IsString()
  customerZIP?: string;

  @IsOptional()
  @IsString()
  customerCountry?: string;

  @IsOptional()
  @IsInt()
  createdBy?: number;

  @IsOptional()
  @IsInt()
  modifiedBy?: number;
}

// Nested DTOs for complex search parameters
export class CustomerTypeDto {
  @IsOptional()
  @IsString()
  LookUpIds?: string;
}

export class UserIdsDto {
  @IsOptional()
  @IsString()
  UserIds?: string;
}

export class DateRangeDto {
  @IsOptional()
  @IsString()
  FromDate?: string;

  @IsOptional()
  @IsString()
  ToDate?: string;
}

// Get Agents List DTO
export class GetAgentsListDto {
  @IsOptional()
  @IsString()
  CustomerIds?: string;

  @IsOptional()
  @IsInt()
  CustomerParentId?: number;

  @IsOptional()
  @IsString()
  CustomerStatusIds?: string;

  @IsOptional()
  @ValidateNested()
  @Type(() => CustomerTypeDto)
  CustomerType?: CustomerTypeDto;

  @IsOptional()
  @IsString()
  CustomerIdz?: string;

  @IsOptional()
  @IsString()
  CustomerName?: string;

  @IsOptional()
  @IsString()
  CustomerPhoneNumber?: string;

  @IsOptional()
  @IsString()
  CustomerMobileNumber?: string;

  @IsOptional()
  @IsString()
  CustomerFaxNumber?: string;

  @IsOptional()
  @IsString()
  CustomerCity?: string;

  @IsOptional()
  @IsString()
  CustomerCountry?: string;

  @IsOptional()
  @ValidateNested()
  @Type(() => UserIdsDto)
  CreatedBy?: UserIdsDto;

  @IsOptional()
  @ValidateNested()
  @Type(() => UserIdsDto)
  ModifiedBy?: UserIdsDto;

  @IsOptional()
  @ValidateNested()
  @Type(() => DateRangeDto)
  CreatedDate?: DateRangeDto;

  @IsOptional()
  @ValidateNested()
  @Type(() => DateRangeDto)
  ModifiedDate?: DateRangeDto;

  @IsOptional()
  @IsInt()
  @Min(1)
  ItemsPerPage?: number;

  @IsOptional()
  @IsInt()
  @Min(1)
  PageNumber?: number;

  @IsOptional()
  @IsBoolean()
  IncludeTotalRowsLength?: boolean;

  @IsOptional()
  @IsString()
  GroupBy?: string;
}

// Get Agent Details DTO
export class GetAgentDetailsDto {
  @IsInt()
  CustomerId: number;
}

// Delete Agent DTO
export class DeleteAgentDto {
  @IsInt()
  CustomerId: number;
}
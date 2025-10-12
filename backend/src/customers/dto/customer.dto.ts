import { IsString, IsOptional, IsInt, IsNumber, IsBoolean, IsEnum } from 'class-validator';
import { Type } from 'class-transformer';
import { CustomerRequestType } from '../../shared/enums/customer.enum';


export class CustomerRequestDto {
  @IsEnum(CustomerRequestType)
  ReqType: CustomerRequestType;

  @IsOptional()
  ReqObject?: any;
}


export class SaveCustomerDto {
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

  @IsString()
  customerName: string;

  @IsOptional()
  @IsNumber()
  customerOpeningBalance?: number;

  @IsOptional()
  @IsNumber()
  customerAllowedExcessAmount?: number;

  @IsOptional()
  @IsInt()
  customerAllowedExcessDays?: number;

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


export class CustomerSearchDto {
  @IsOptional()
  @IsString()
  CustomerIds?: string;

  @IsOptional()
  @IsString()
  CustomerParentIds?: string;

  @IsOptional()
  @IsString()
  CustomerStatusIds?: string;

  @IsOptional()
  CustomerType?: { LookUpIds?: string };

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
  CreatedBy?: { UserIds?: string };

  @IsOptional()
  ModifiedBy?: { UserIds?: string };

  @IsOptional()
  CreatedDate?: { FromDate?: string; ToDate?: string };

  @IsOptional()
  ModifiedDate?: { FromDate?: string; ToDate?: string };

  @IsOptional()
  @IsInt()
  @Type(() => Number)
  ItemsPerPage?: number;

  @IsOptional()
  @IsInt()
  @Type(() => Number)
  PageNumber?: number;

  @IsOptional()
  @IsBoolean()
  IncludeTotalRowsLength?: boolean;

  @IsOptional()
  @IsString()
  GroupBy?: string;
}


export class GetCustomerDetailsDto {
  @IsInt()
  CustomerId: number;
}

export class DeleteCustomerDto {
  @IsInt()
  CustomerId: number;
}

export class DeleteCustomersDto {
  @IsString()
  CustomerIds: string;
}

export class ChangeCustomersStatusDto {
  @IsString()
  CustomerIds: string;

  @IsInt()
  StatusId: number;
}
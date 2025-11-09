import { IsString, IsOptional, IsInt, IsNumber, IsBoolean, ValidateNested, Min } from 'class-validator';
import { Type } from 'class-transformer';

// Base request DTO
export class DriverRequestDto {
  @IsString()
  ReqType: string;

  @IsOptional()
  ReqObject?: any;
}

// Save Driver DTO
export class SaveDriverDto {
  @IsOptional()
  @IsInt()
  driverId?: number;

  @IsOptional()
  @IsInt()
  driverParentId?: number;

  @IsOptional()
  @IsInt()
  driverStatusId?: number;

  @IsOptional()
  @IsInt()
  driverTypeId?: number;

  @IsOptional()
  @IsString()
  driverIdz?: string;

  @IsOptional()
  @IsString()
  carNumber?: string;

  @IsOptional()
  @IsString()
  driverName?: string;

  @IsOptional()
  @IsString()
  driverNotes?: string;

  @IsOptional()
  @IsString()
  driverProfileImage?: string;

  @IsOptional()
  @IsString()
  driverEmails?: string;

  @IsOptional()
  @IsString()
  driverPhoneNumber?: string;

  @IsOptional()
  @IsString()
  driverMobileNumber?: string;

  @IsOptional()
  @IsString()
  driverFaxNumber?: string;

  @IsOptional()
  @IsString()
  driverAddressLine1?: string;

  @IsOptional()
  @IsString()
  driverAddressLine2?: string;

  @IsOptional()
  @IsString()
  driverCity?: string;

  @IsOptional()
  @IsString()
  driverState?: string;

  @IsOptional()
  @IsString()
  driverZIP?: string;

  @IsOptional()
  @IsString()
  driverCountry?: string;

  @IsOptional()
  @IsInt()
  createdBy?: number;

  @IsOptional()
  @IsInt()
  modifiedBy?: number;
}

// Nested DTOs for complex search parameters
export class DriverParentDto {
  @IsOptional()
  @IsString()
  DriverIds?: string;
}

export class DriverTypeDto {
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

// Get Drivers List DTO
export class GetDriversListDto {
  @IsOptional()
  @IsString()
  DriverIds?: string;

  @IsOptional()
  @ValidateNested()
  @Type(() => DriverParentDto)
  DriverParent?: DriverParentDto;

  @IsOptional()
  @IsString()
  DriverStatusIds?: string;

  @IsOptional()
  @ValidateNested()
  @Type(() => DriverTypeDto)
  DriverType?: DriverTypeDto;

  @IsOptional()
  @IsString()
  DriverIdz?: string;

  @IsOptional()
  @IsString()
  CarNumber?: string;

  @IsOptional()
  @IsString()
  DriverName?: string;

  @IsOptional()
  @IsString()
  DriverPhoneNumber?: string;

  @IsOptional()
  @IsString()
  DriverMobileNumber?: string;

  @IsOptional()
  @IsString()
  DriverFaxNumber?: string;

  @IsOptional()
  @IsString()
  DriverCity?: string;

  @IsOptional()
  @IsString()
  DriverCountry?: string;

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

// Get Driver Details DTO
export class GetDriverDetailsDto {
  @IsInt()
  DriverId: number;
}

// Delete Driver DTO
export class DeleteDriverDto {
  @IsInt()
  DriverId: number;
}
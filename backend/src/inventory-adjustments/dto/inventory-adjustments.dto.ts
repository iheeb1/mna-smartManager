import { IsString, IsOptional, IsInt, IsBoolean, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

// Base DTOs for nested objects
export class DateRangeDto {
  @IsOptional()
  @IsString()
  FromDate?: string;

  @IsOptional()
  @IsString()
  ToDate?: string;
}

export class LookUpDto {
  @IsOptional()
  @IsInt()
  LookUpId?: number;
}

export class UserDto {
  @IsOptional()
  @IsInt()
  UserId?: number;
}

// Save Inventory Adjustment DTO
export class SaveInventoryAdjustmentDto {
  @IsOptional()
  @IsInt()
  AdjustmentId?: number;

  @IsOptional()
  @IsString()
  AdjustmentDate?: string;

  @IsOptional()
  @IsInt()
  adjustmentStatusId?: number;

  @IsOptional()
  @IsInt()
  adjustmentTypeId?: number;

  @IsOptional()
  @IsString()
  Description?: string;

  @IsOptional()
  @IsInt()
  createdBy?: number;

  @IsOptional()
  @IsInt()
  modifiedBy?: number;

  @IsOptional()
  AdjustmentItems?: any[];
}

// Get Inventory Adjustments List DTO
export class GetInventoryAdjustmentsListDto {
  @IsOptional()
  @IsInt()
  AdjustmentId?: number;

  @IsOptional()
  @ValidateNested()
  @Type(() => DateRangeDto)
  AdjustmentDate?: DateRangeDto;

  @IsOptional()
  @ValidateNested()
  @Type(() => LookUpDto)
  AdjustmentStatus?: LookUpDto;

  @IsOptional()
  @ValidateNested()
  @Type(() => LookUpDto)
  AdjustmentType?: LookUpDto;

  @IsOptional()
  @ValidateNested()
  @Type(() => UserDto)
  CreatedBy?: UserDto;

  @IsOptional()
  @ValidateNested()
  @Type(() => UserDto)
  ModifiedBy?: UserDto;

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
  ItemsPerPage?: number;

  @IsOptional()
  @IsInt()
  PageNumber?: number;

  @IsOptional()
  @IsBoolean()
  includeAdjustmentItems?: boolean;

  @IsOptional()
  @IsBoolean()
  IncludeTotalRowsLength?: boolean;

  @IsOptional()
  @IsString()
  GroupBy?: string;
}

// Get Inventory Adjustment Details DTO
export class GetInventoryAdjustmentDetailsDto {
  @IsOptional()
  @IsInt()
  AdjustmentId?: number;

  @IsOptional()
  @IsBoolean()
  includeAdjustmentItems?: boolean;
}

// Delete Inventory Adjustment DTO
export class DeleteInventoryAdjustmentDto {
  @IsOptional()
  @IsInt()
  AdjustmentId?: number;
}

// Change Inventory Adjustment Status DTO
export class ChangeInventoryAdjustmentStatusDto {
  @IsOptional()
  @IsInt()
  AdjustmentId?: number;

  @IsOptional()
  @IsInt()
  AdjustmentStatusId?: number;
}

// Main Request DTO
export class InventoryAdjustmentRequestDto {
  @IsString()
  ReqType: any;

  @IsOptional()
  ReqObject?:
    | SaveInventoryAdjustmentDto
    | GetInventoryAdjustmentsListDto
    | GetInventoryAdjustmentDetailsDto
    | DeleteInventoryAdjustmentDto
    | ChangeInventoryAdjustmentStatusDto;
}
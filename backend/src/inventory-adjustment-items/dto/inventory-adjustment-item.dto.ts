import { IsString, IsOptional, IsInt, IsNumber, IsBoolean, ValidateNested, Min } from 'class-validator';
import { Type } from 'class-transformer';

// Base request DTO
export class InventoryAdjustmentItemRequestDto {
  @IsString()
  ReqType: string;

  @IsOptional()
  ReqObject?: any;
}

// Save Inventory Adjustment Item DTO
export class SaveInventoryAdjustmentItemDto {
  @IsOptional()
  @IsInt()
  adjustmentItemId?: number;

  @IsOptional()
  @IsInt()
  adjustmentId?: number;

  @IsOptional()
  @IsInt()
  productItemId?: number;

  @IsOptional()
  @IsInt()
  productItemCostTypeId?: number;

  @IsOptional()
  @IsNumber()
  productItemCost?: number;

  @IsOptional()
  @IsNumber()
  productItemAdjustedCost?: number;

  @IsOptional()
  @IsString()
  referenceNumber?: string;

  @IsOptional()
  @IsInt()
  adjustmentItemNewStockUnits?: number;

  @IsOptional()
  @IsInt()
  palletsAmount?: number;

  @IsOptional()
  @IsInt()
  adjustmentItemStatusId?: number;

  @IsOptional()
  @IsInt()
  adjustmentItemReasonId?: number;

  @IsOptional()
  @IsInt()
  createdBy?: number;

  @IsOptional()
  @IsInt()
  modifiedBy?: number;
}

// Nested DTOs for complex search parameters
export class AdjustmentDto {
  @IsOptional()
  @IsInt()
  AdjustmentId?: number;
}

export class ProductDto {
  @IsOptional()
  @IsInt()
  ProductId?: number;
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

export class DateRangeDto {
  @IsOptional()
  @IsString()
  FromDate?: string;

  @IsOptional()
  @IsString()
  ToDate?: string;
}

// Get Inventory Adjustment Items List DTO
export class GetInventoryAdjustmentItemsListDto {
  @IsOptional()
  @IsInt()
  AdjustmentItemId?: number;

  @IsOptional()
  @ValidateNested()
  @Type(() => AdjustmentDto)
  Adjustment?: AdjustmentDto;

  @IsOptional()
  @ValidateNested()
  @Type(() => ProductDto)
  Product?: ProductDto;

  @IsOptional()
  @IsString()
  ReferenceNumber?: string;

  @IsOptional()
  @ValidateNested()
  @Type(() => LookUpDto)
  AdjustmentItemStatus?: LookUpDto;

  @IsOptional()
  @ValidateNested()
  @Type(() => LookUpDto)
  AdjustmentItemReason?: LookUpDto;

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

// Get Inventory Adjustment Item Details DTO
export class GetInventoryAdjustmentItemDetailsDto {
  @IsInt()
  AdjustmentItemId: number;
}

// Delete Inventory Adjustment Item DTO
export class DeleteInventoryAdjustmentItemDto {
  @IsInt()
  AdjustmentItemId: number;
}
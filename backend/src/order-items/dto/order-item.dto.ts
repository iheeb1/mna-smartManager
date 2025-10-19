import { IsString, IsOptional, IsNumber, IsBoolean, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { CustomerDto, CarDto, ProductDto, LookUpDto, DateDto, PriceDto, UserDto } from '../../orders/dto/order.dto';

// Order reference DTO
export class OrderRefDto {
  @IsOptional()
  @IsNumber()
  orderId?: number;

  @IsOptional()
  @IsString()
  orderIds?: string;

  @IsOptional()
  @ValidateNested()
  @Type(() => CarDto)
  car?: CarDto;

  @IsOptional()
  @ValidateNested()
  @Type(() => DateDto)
  orderDate?: DateDto;
}

// Main OrderItem DTO
export class OrderItemDto {
  @IsOptional()
  @IsNumber()
  orderItemId?: number;

  @IsOptional()
  @IsString()
  orderItemIds?: string;

  @IsOptional()
  @ValidateNested()
  @Type(() => OrderRefDto)
  order?: OrderRefDto;

  @IsOptional()
  @ValidateNested()
  @Type(() => CustomerDto)
  customer?: CustomerDto;

  @IsOptional()
  @ValidateNested()
  @Type(() => CustomerDto)
  agent?: CustomerDto;

  @IsOptional()
  @ValidateNested()
  @Type(() => CarDto)
  car?: CarDto;

  @IsOptional()
  @ValidateNested()
  @Type(() => ProductDto)
  orderType?: ProductDto;

  @IsOptional()
  @ValidateNested()
  @Type(() => DateDto)
  orderDate?: DateDto;

  @IsOptional()
  @IsNumber()
  orderUnitsNumber?: number;

  @IsOptional()
  @ValidateNested()
  @Type(() => PriceDto)
  orderPrice?: PriceDto;

  @IsOptional()
  @ValidateNested()
  @Type(() => LookUpDto)
  orderStatus?: LookUpDto;

  @IsOptional()
  @IsString()
  orderNotes?: string;

  @IsOptional()
  @ValidateNested()
  @Type(() => LookUpDto)
  fromLocation?: LookUpDto;

  @IsOptional()
  @ValidateNested()
  @Type(() => LookUpDto)
  toLocation?: LookUpDto;

  @IsOptional()
  @IsString()
  shippingCertificateId?: string;

  @IsOptional()
  @ValidateNested()
  @Type(() => UserDto)
  createdBy?: UserDto;

  @IsOptional()
  @ValidateNested()
  @Type(() => UserDto)
  modifiedBy?: UserDto;

  @IsOptional()
  @ValidateNested()
  @Type(() => DateDto)
  createdDate?: DateDto;

  @IsOptional()
  @ValidateNested()
  @Type(() => DateDto)
  modifiedDate?: DateDto;
}

// Request wrapper DTOs
export class SaveOrderItemDetailsDto {
  @ValidateNested()
  @Type(() => OrderItemDto)
  reqObject: OrderItemDto;
}

export class GetOrderItemsListDto extends OrderItemDto {
  @IsOptional()
  @IsNumber()
  itemsPerPage?: number;

  @IsOptional()
  @IsNumber()
  pageNumber?: number;

  @IsOptional()
  @IsBoolean()
  includeTotalRowsLength?: boolean;

  @IsOptional()
  @IsString()
  groupBy?: string;
}

export class GetOrderItemDetailsDto {
  @IsNumber()
  orderItemId: number;
}

export class GetLastOrderItemDetailsDto {
  @IsNumber()
  customerId: number;

  @IsNumber()
  orderTypeId: number;
}

export class DeleteOrderItemDto {
  @IsNumber()
  orderItemId: number;
}

// Generic request wrapper
export class OrderItemRequestDto {
  @IsString()
  reqType: string;

  @IsOptional()
  reqObject?: any;
}
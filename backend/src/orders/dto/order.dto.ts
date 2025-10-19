import { IsString, IsOptional, IsNumber, IsBoolean, IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

export class CustomerDto {
  @IsOptional()
  @IsNumber()
  customerId?: number;

  @IsOptional()
  @IsString()
  customerIds?: string;

  @IsOptional()
  @IsString()
  customerIdz?: string;

  @IsOptional()
  @IsString()
  customerName?: string;

  @IsOptional()
  @IsString()
  customerCity?: string;
}

export class CarDto {
  @IsOptional()
  @IsNumber()
  carId?: number;

  @IsOptional()
  @IsString()
  carIds?: string;

  @IsOptional()
  @IsString()
  carNumber?: string;
}

export class ProductDto {
  @IsOptional()
  @IsNumber()
  productId?: number;

  @IsOptional()
  @IsString()
  productIds?: string;

  @IsOptional()
  @IsString()
  productName?: string;

  @IsOptional()
  @IsString()
  productCode?: string;
}

export class LookUpDto {
  @IsOptional()
  @IsNumber()
  lookUpId?: number;

  @IsOptional()
  @IsString()
  lookUpIds?: string;

  @IsOptional()
  @IsString()
  lookUpName?: string;
}

export class DateDto {
  @IsOptional()
  fullDate?: Date;

  @IsOptional()
  @IsString()
  fromDate?: string;

  @IsOptional()
  @IsString()
  toDate?: string;
}

export class PriceDto {
  @IsOptional()
  @IsNumber()
  itemPrice?: number;

  @IsOptional()
  @IsNumber()
  itemVat?: number;

  @IsOptional()
  @IsBoolean()
  itemIncludeVat?: boolean;

  @IsOptional()
  @IsNumber()
  totalItemPriceWithOutVat?: number;

  @IsOptional()
  @IsNumber()
  totalItemPriceVat?: number;

  @IsOptional()
  @IsNumber()
  totalItemPriceWithVat?: number;

  @IsOptional()
  @IsNumber()
  totalItemCost?: number;

  @IsOptional()
  @IsNumber()
  totalItemProfit?: number;

  @IsOptional()
  @IsNumber()
  itemCost?: number;

  @IsOptional()
  @IsNumber()
  itemProfit?: number;
}

export class UserDto {
  @IsOptional()
  @IsNumber()
  userId?: number;

  @IsOptional()
  @IsString()
  userIds?: string;

  @IsOptional()
  @IsString()
  fullName?: string;
}

export class OrderDto {
  @IsOptional()
  @IsNumber()
  orderId?: number;

  @IsOptional()
  @IsString()
  orderIds?: string;

  @IsOptional()
  @ValidateNested()
  @Type(() => CustomerDto)
  customer?: CustomerDto;

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
  @IsNumber()
  meters?: number;

  @IsOptional()
  @IsNumber()
  cubes?: number;

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

  @IsOptional()
  @IsArray()
  orderItems?: any[];

  @IsOptional()
  @IsBoolean()
  showOrderItems?: boolean;

  @IsOptional()
  @IsNumber()
  totalOrdersWithOutVat?: number;

  @IsOptional()
  @IsNumber()
  totalOrdersVat?: number;

  @IsOptional()
  @IsNumber()
  totalOrdersWithVat?: number;

  @IsOptional()
  @IsNumber()
  totalOrdersCosts?: number;

  @IsOptional()
  @IsNumber()
  totalOrdersProfit?: number;
}

export class SaveOrderDetailsDto {
  @ValidateNested()
  @Type(() => OrderDto)
  reqObject: OrderDto;
}

export class GetOrdersListDto extends OrderDto {
  @IsOptional()
  @IsNumber()
  itemsPerPage?: number;

  @IsOptional()
  @IsNumber()
  pageNumber?: number;

  @IsOptional()
  @IsBoolean()
  includeOrderItems?: boolean;

  @IsOptional()
  @IsBoolean()
  includeTotalRowsLength?: boolean;

  @IsOptional()
  @IsString()
  groupBy?: string;
}

export class GetOrderDetailsDto {
  @IsNumber()
  orderId: number;

  @IsOptional()
  @IsBoolean()
  includeOrderItems?: boolean;
}

export class DeleteOrderDto {
  @IsNumber()
  orderId: number;
}

export class DeleteOrdersDto {
  @IsString()
  orderIds: string;
}

export class ChangeOrdersStatusDto {
  @IsString()
  orderIds: string;

  @IsNumber()
  statusId: number;
}

export class OrderRequestDto {
  @IsString()
  reqType: string;

  @IsOptional()
  reqObject?: any;
}
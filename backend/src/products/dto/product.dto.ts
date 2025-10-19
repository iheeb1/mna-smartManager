import { IsOptional, IsInt, IsString, IsBoolean, IsNumber, IsNotEmpty } from 'class-validator';

// Main request DTO
export class ProductRequestDto {
  @IsString()
  @IsNotEmpty()
  reqType: string;

  @IsOptional()
  reqObject?: any;
}

// DTO for getting products list
export class GetProductsListDto {
  @IsOptional()
  @IsInt()
  productId?: number;

  @IsOptional()
  @IsString()
  categoryIds?: string;

  @IsOptional()
  @IsString()
  brandIds?: string;

  @IsOptional()
  @IsString()
  productCode?: string;

  @IsOptional()
  @IsString()
  productName?: string;

  @IsOptional()
  @IsInt()
  returnableItem?: number;

  @IsOptional()
  @IsString()
  productStatusIds?: string;

  @IsOptional()
  @IsInt()
  createdById?: number;

  @IsOptional()
  @IsInt()
  modifiedById?: number;

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
  @IsBoolean()
  onlyHasProductsItems?: boolean;

  @IsOptional()
  @IsInt()
  itemsPerPage?: number = 30;

  @IsOptional()
  @IsInt()
  pageNumber?: number = 0;

  @IsOptional()
  @IsBoolean()
  includeProductItems?: boolean;

  @IsOptional()
  @IsBoolean()
  includeTotalRowsLength?: boolean;
}

// DTO for saving product
export class SaveProductDto {
  @IsOptional()
  @IsInt()
  productId?: number;

  @IsString()
  productCode: string;

  @IsString()
  productName: string;

  @IsOptional()
  @IsInt()
  categoryId?: number;

  @IsOptional()
  @IsString()
  productSize?: string;

  @IsOptional()
  @IsInt()
  manufacturerId?: number;

  @IsOptional()
  @IsInt()
  brandId?: number;

  @IsOptional()
  @IsNumber()
  productPrice?: number;

  @IsOptional()
  @IsString()
  productImage?: string;

  @IsOptional()
  @IsInt()
  returnableItem?: number;

  @IsOptional()
  @IsInt()
  includeVariants?: number;

  @IsOptional()
  productVariants?: any[];

  @IsOptional()
  @IsInt()
  productStatusId?: number;

  @IsOptional()
  @IsInt()
  createdBy?: number;

  @IsOptional()
  @IsInt()
  modifiedBy?: number;
}

// Product variant interface
export interface ProductVariant {
  attributeId: number;
  attributeName: string;
  options: string[];
}

// Response DTO
export class ProductResponseDto {
  productId: number;
  productCode: string;
  productName: string;
  category: {
    lookUpId: number;
    lookUpName: string;
  };
  productSize: string;
  manufacturer: {
    lookUpId: number;
    lookUpName: string;
  };
  brand: {
    lookUpId: number;
    lookUpName: string;
  };
  productPrice: number;
  productImage: string;
  returnableItem: number;
  includeVariants: number;
  productVariants: ProductVariant[];
  productStatus: {
    lookUpId: number;
    lookUpName: string;
  };
  createdBy: {
    userId: number;
    fullName: string;
  };
  modifiedBy: {
    userId: number;
    fullName: string;
  };
  createdDate: Date;
  modifiedDate: Date;
}
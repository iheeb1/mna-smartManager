import { IsOptional, IsInt, IsString, IsBoolean } from 'class-validator';

export class CarRequestDto {
  reqType: string;
  reqObject?: any;
}

export class GetCarsListDto {
  @IsOptional()
  @IsString()
  carIds?: string;

  @IsOptional()
  @IsString()
  objectIds?: string;

  @IsOptional()
  @IsString()
  carStatusIds?: string;

  @IsOptional()
  @IsString()
  carNumber?: string;

  @IsOptional()
  @IsString()
  createdByIds?: string;

  @IsOptional()
  @IsString()
  modifiedByIds?: string;

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
  @IsInt()
  itemsPerPage?: number = 30;

  @IsOptional()
  @IsInt()
  pageNumber?: number = 0;

  @IsOptional()
  @IsBoolean()
  includeTotalRowsLength?: boolean;
}

export class SaveCarDto {
  @IsOptional()
  @IsInt()
  carId?: number;

  @IsInt()
  objectId: number; // Customer ID

  @IsOptional()
  @IsInt()
  carStatusId?: number;

  @IsString()
  carNumber: string;

  @IsOptional()
  @IsString()
  carNotes?: string;

  @IsOptional()
  @IsInt()
  createdBy?: number;

  @IsOptional()
  @IsInt()
  modifiedBy?: number;
}

export class CarResponseDto {
  carId: number;
  objectId: number;
  carStatusId: number;
  carNumber: string;
  carNotes: string;
  createdBy: number;
  modifiedBy: number;
  createdDate: Date;
  modifiedDate: Date;
  customer?: {
    customerId: number;
    customerName: string;
    customerIdz: string;
  };
}
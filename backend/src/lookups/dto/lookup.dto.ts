import { IsOptional, IsInt, IsString, IsNotEmpty } from 'class-validator';

// Main request DTO
export class LookupRequestDto {
  @IsString()
  @IsNotEmpty()
  reqType: string;

  @IsOptional()
  reqObject?: any;
}

// DTO for getting lookups
export class GetLookupsDto {
  @IsOptional()
  @IsInt()
  lookUpId?: number;

  @IsOptional()
  @IsString()
  lookUpTableName?: string;

  @IsOptional()
  @IsString()
  lookUpName?: string;

  @IsOptional()
  @IsString()
  lookUpCode?: string;

  @IsOptional()
  @IsString()
  param1?: string;

  @IsOptional()
  @IsString()
  param2?: string;

  @IsOptional()
  @IsString()
  param3?: string;

  @IsOptional()
  @IsInt()
  lookUpStatusId?: number;

  @IsOptional()
  @IsInt()
  lookUpTypeId?: number;
}

// DTO for saving lookup
export class SaveLookupDto {
  @IsOptional()
  @IsInt()
  lookUpId?: number;

  @IsString()
  lookUpTableName: string;

  @IsOptional()
  @IsString()
  lookUpCode?: string;

  @IsString()
  lookUpName: string;

  @IsOptional()
  @IsString()
  param1?: string;

  @IsOptional()
  @IsString()
  param2?: string;

  @IsOptional()
  @IsString()
  param3?: string;

  @IsOptional()
  @IsInt()
  lookUpStatusId?: number;

  @IsOptional()
  @IsInt()
  lookUpTypeId?: number;

  @IsOptional()
  @IsString()
  lookUpTypeName?: string;

  @IsOptional()
  lookUpData?: any;

  @IsOptional()
  @IsInt()
  createdBy?: number;

  @IsOptional()
  @IsInt()
  modifiedBy?: number;
}

// Response DTO
export class LookupResponseDto {
  lookUpId: number;
  lookUpTableName: string;
  lookUpCode: string;
  lookUpName: string;
  param1: string;
  param2: string;
  param3: string;
  lookUpStatusId: number;
  lookUpStatusName: string;
  lookUpTypeId: number;
  lookUpTypeName: string;
  lookUpData: any;
  createdBy: number;
  modifiedBy: number;
  createdDate: Date;
  modifiedDate: Date;
  createdDateStr: string;
  modifiedDateStr: string;
}
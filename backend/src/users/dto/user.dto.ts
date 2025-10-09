import { IsString, IsOptional, IsNumber, IsNotEmpty } from 'class-validator';

export class CreateUserDto {
  @IsOptional()
  @IsNumber()
  userId?: number;

  @IsOptional()
  @IsNumber()
  userStatus?: number;

  @IsOptional()
  @IsNumber()
  userType?: number;

  @IsOptional()
  @IsString()
  fullName?: string;

  @IsNotEmpty()
  @IsString()
  userName: string;

  @IsNotEmpty()
  @IsString()
  password: string;

  @IsOptional()
  @IsString()
  phoneNumber?: string;

  @IsOptional()
  @IsString()
  mobileNumber?: string;

  @IsOptional()
  @IsString()
  faxNumber?: string;

  @IsOptional()
  @IsString()
  addressLine1?: string;

  @IsOptional()
  @IsString()
  addressLine2?: string;

  @IsOptional()
  @IsString()
  city?: string;

  @IsOptional()
  @IsString()
  state?: string;

  @IsOptional()
  @IsString()
  zip?: string;

  @IsOptional()
  @IsString()
  country?: string;

  @IsOptional()
  @IsString()
  profileImage?: string;

  @IsOptional()
  @IsString()
  resetGuId?: string;

  @IsOptional()
  @IsNumber()
  createdBy?: number;

  @IsOptional()
  @IsNumber()
  modifiedBy?: number;
}

export class GetUsersDto {
  @IsOptional()
  userId?: number;

  @IsOptional()
  userStatus?: number;

  @IsOptional()
  userType?: number;

  @IsOptional()
  fullName?: string;

  @IsOptional()
  userName?: string;

  @IsOptional()
  password?: string;

  @IsOptional()
  phoneNumber?: string;

  @IsOptional()
  mobileNumber?: string;

  @IsOptional()
  faxNumber?: string;

  @IsOptional()
  city?: string;

  @IsOptional()
  createdBy?: number;

  @IsOptional()
  modifiedBy?: number;

  @IsOptional()
  fromCreatedDate?: string;

  @IsOptional()
  toCreatedDate?: string;

  @IsOptional()
  fromModifiedDate?: string;

  @IsOptional()
  toModifiedDate?: string;

  @IsOptional()
  itemsPerPage?: number;

  @IsOptional()
  pageNumber?: number;
}

export class LoginDto {
  @IsNotEmpty()
  @IsString()
  userName: string;

  @IsNotEmpty()
  @IsString()
  password: string;
}

export class ConvertPasswordDto {
  @IsNotEmpty()
  @IsString()
  password: string;
}
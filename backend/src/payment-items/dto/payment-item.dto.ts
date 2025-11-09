import { IsString, IsOptional } from 'class-validator';

export class PaymentItemRequestDto {
  @IsString()
  ReqType: string;

  @IsOptional()
  ReqObject?: any;
}
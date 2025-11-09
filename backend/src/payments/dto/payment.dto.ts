import { IsString, IsOptional } from 'class-validator';

export class PaymentRequestDto {
  @IsString()
  ReqType: string;

  @IsOptional()
  ReqObject?: any;
}
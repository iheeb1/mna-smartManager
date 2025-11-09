import { IsString, IsOptional } from 'class-validator';

export class QuoteItemRequestDto {
  @IsString()
  ReqType: string;

  @IsOptional()
  ReqObject?: any;
}
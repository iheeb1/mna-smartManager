import { IsString, IsOptional } from 'class-validator';

export class QuoteRequestDto {
  @IsString()
  ReqType: string;

  @IsOptional()
  ReqObject?: any;
}
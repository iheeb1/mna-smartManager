import { IsString, IsOptional } from 'class-validator';

export class TransportationRequestDto {
  @IsString()
  ReqType: string;

  @IsOptional()
  ReqObject?: any;
}
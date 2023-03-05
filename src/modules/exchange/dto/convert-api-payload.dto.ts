import { IsString, MinLength, MaxLength, Matches, IsNotEmpty, IsNumber, Min, IsEnum } from 'class-validator';
import { ValidCurrency } from '../entities/exchange.entity';

export class ConvertApiPayload {
  @IsNotEmpty()
  @IsNumber()
  @Min(0)
  value: number;

  @IsEnum(ValidCurrency)
  from: ValidCurrency;

  @IsEnum(ValidCurrency)
  to: ValidCurrency;
}
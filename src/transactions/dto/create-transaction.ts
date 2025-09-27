import { IsString, IsNumber } from 'class-validator';

export class CreateTransactionDto {
  @IsString()
  type: string;

  @IsNumber()
  quantity: number;

  @IsString()
  note: string;
}

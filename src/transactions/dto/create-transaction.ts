import { IsString, IsNumber, IsEnum } from 'class-validator';

export enum TransactionType {
  IN = 'IN',
  OUT = 'OUT',
  NEW = 'NEW',
}

export class CreateTransactionDto {
  @IsEnum(TransactionType, { message: 'type must be IN, OUT or NEW' })
  type: TransactionType;

  @IsNumber()
  quantity: number;

  @IsString()
  note: string;
}

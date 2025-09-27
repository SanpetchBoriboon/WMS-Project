import { PartialType } from '@nestjs/mapped-types';
import { CreateTransactionDto } from './create-transaction';

export class UpdateTransactionDto extends PartialType(CreateTransactionDto) {}

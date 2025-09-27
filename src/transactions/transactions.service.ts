import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  Transaction,
  TransactionDocument,
} from 'src/schemas/transaction.schema';
import { CreateTransactionDto } from 'src/transactions/dto/create-transaction';

@Injectable()
export class TransactionsService {
  constructor(
    @InjectModel(Transaction.name)
    private transactionModel: Model<TransactionDocument>,
  ) {}

  async createTransaction(
    createStoreDto: CreateTransactionDto,
    productId: string,
  ) {
    const transaction = new this.transactionModel(createStoreDto);
    await transaction.save();

    await this.transactionModel.findByIdAndUpdate(transaction._id, {
      product: productId,
    });

    return transaction;
  }
}

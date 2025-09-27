import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  Transaction,
  TransactionDocument,
} from 'src/schemas/transaction.schema';
import { CreateStoreDto } from 'src/stores/dto/create-store.dto';

@Injectable()
export class TransactionsService {
  constructor(
    @InjectModel(Transaction.name)
    private transactionModel: Model<TransactionDocument>,
  ) {}

  async createStore(createStoreDto: CreateStoreDto, productId: string) {
    const transaction = new this.transactionModel(createStoreDto);
    await transaction.save();

    await this.transactionModel.findByIdAndUpdate(transaction._id, {
      $push: { product: productId },
    });

    return transaction;
  }
}

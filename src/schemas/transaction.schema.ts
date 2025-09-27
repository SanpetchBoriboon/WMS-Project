import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { Product } from './product.schema';

export type TransactionDocument = Transaction & Document;

@Schema({ timestamps: true })
export class Transaction {
  @Prop({ enum: ['IN', 'OUT', 'NEW'] })
  type: string;

  @Prop()
  note?: string;

  @Prop()
  quantity: string;

  @Prop({ type: Types.ObjectId, ref: 'Product' })
  product: Product;
}

export const TransactionSchema = SchemaFactory.createForClass(Transaction);

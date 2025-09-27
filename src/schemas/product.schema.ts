import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { Store } from './store.schema';

export type ProductDocument = Product & Document;

@Schema({ timestamps: true })
export class Product {
  @Prop({ required: true })
  productName: string;

  @Prop()
  stock: number;

  @Prop()
  price: number;

  @Prop()
  createBy: string;

  @Prop()
  updateBy: string;

  @Prop({ type: [{ type: Types.ObjectId, ref: 'Store' }] })
  store: Store[];
}

export const ProductSchema = SchemaFactory.createForClass(Product);

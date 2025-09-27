import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { User } from './user.schema';

export type StoreDocument = Store & Document;

@Schema({ timestamps: true })
export class Store {
  @Prop({ required: true })
  storeName: string;

  @Prop()
  address?: string;

  @Prop()
  tel?: string;

  @Prop({ type: [{ type: Types.ObjectId, ref: 'User' }] })
  owners: User[];
}

export const StoreSchema = SchemaFactory.createForClass(Store);

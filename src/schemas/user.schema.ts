/* eslint-disable @typescript-eslint/no-unsafe-argument */
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { Store } from './store.schema';

export type UserDocument = User & Document;

@Schema({ timestamps: true }) // จะได้ createdAt, updatedAt อัตโนมัติ
export class User {
  @Prop({ required: true, unique: true })
  username: string;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true })
  password: string;

  @Prop({ enum: ['ADMIN', 'STAFF'], required: true })
  role: string;

  @Prop()
  name: string;

  @Prop()
  lastName?: string;

  @Prop()
  tel?: string;

  @Prop()
  address?: string;

  @Prop({ type: [{ type: Types.ObjectId, ref: 'Store' }] })
  store: Store[];
}

export const UserSchema = SchemaFactory.createForClass(User);

UserSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();

  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (err) {
    next(err);
  }
});

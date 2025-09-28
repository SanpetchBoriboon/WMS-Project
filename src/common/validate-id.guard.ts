/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import {
  CanActivate,
  ExecutionContext,
  Injectable,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Store, StoreDocument } from '../schemas/store.schema';
import { User, UserDocument } from '../schemas/user.schema';

@Injectable()
export class ValidateIdGuard implements CanActivate {
  constructor(
    @InjectModel(Store.name) private storeModel: Model<StoreDocument>,
    @InjectModel(User.name) private userModel: Model<UserDocument>,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const { storeId } = request.params;
    const userId = request.user?.userId; // มาจาก JwtAuthGuard

    if (userId) {
      const user = await this.userModel.findById(userId).exec();
      if (!user) {
        throw new HttpException('User does not exist', HttpStatus.BAD_REQUEST);
      }
      request.userDoc = user;
    }

    if (storeId) {
      const store = await this.storeModel.findById(storeId).exec();
      if (!store) {
        throw new HttpException('Store does not exist', HttpStatus.BAD_REQUEST);
      }
      request.storeDoc = store;
    }

    return true;
  }
}

import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateStoreDto } from './dto/create-store.dto';
// import { UpdateStoreDto } from './dto/update-store.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Store, StoreDocument } from '../schemas/store.schema';
import { User, UserDocument } from '../schemas/user.schema';

// shop.service.ts
@Injectable()
export class StoresService {
  constructor(
    @InjectModel(Store.name) private storeModel: Model<StoreDocument>,
    @InjectModel(User.name) private userModel: Model<UserDocument>,
  ) {}

  async createStore(createStoreDto: CreateStoreDto, userId: string) {
    const duplicate = await this.storeModel.findOne({
      storeName: createStoreDto.storeName,
      owners: userId,
    });

    if (duplicate) {
      throw new HttpException(
        { code: 400, message: 'User already has a store with this name' },
        HttpStatus.BAD_REQUEST,
      );
    }
    const store = new this.storeModel(createStoreDto);
    await store.save();

    await this.userModel.findByIdAndUpdate(userId, {
      $push: { store: store._id },
    });

    await this.storeModel.findByIdAndUpdate(store._id, {
      $push: { owners: userId },
    });

    return store;
  }

  async getStore(userId: string) {
    const stores = await this.storeModel.findOne({ owners: userId });
    return stores;
  }
}

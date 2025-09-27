import { Injectable } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
// import { UpdateProductDto } from './dto/update-product.dto';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Store, StoreDocument } from '../schemas/store.schema';
import { Product, ProductDocument } from '../schemas/product.schema';
import { User, UserDocument } from '../schemas/user.schema';

import { HttpException, HttpStatus } from '@nestjs/common';

@Injectable()
export class ProductsService {
  constructor(
    @InjectModel(Store.name) private storeModel: Model<StoreDocument>,
    @InjectModel(Product.name) private productModel: Model<ProductDocument>,
    @InjectModel(User.name) private userModel: Model<UserDocument>,
  ) {}

  async create(
    createProductDto: CreateProductDto,
    userId: string,
    storeId: string,
  ) {
    const user = await this.userModel.findById(userId).exec();
    if (!user) {
      throw new HttpException('User is not registered', HttpStatus.BAD_REQUEST);
    }

    const product = new this.productModel({
      ...createProductDto,
      createBy: userId,
      updateBy: userId,
    });
    await product.save();

    await this.productModel.findByIdAndUpdate(
      product._id,
      {
        $push: { store: storeId },
      },
      { new: true },
    );

    await this.storeModel.findByIdAndUpdate(
      storeId,
      {
        $push: { products: product._id },
        $set: { updateAt: new Date() },
      },
      { new: true },
    );
    return product;
  }

  async getAllProduct(storeId: string): Promise<any> {
    const store = await this.storeModel.findById(storeId);
    if (!store) {
      throw new HttpException('Store is not create', HttpStatus.BAD_REQUEST);
    }

    const products = store.populate('products');

    return products;
  }
}

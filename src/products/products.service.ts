import { Injectable } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Store, StoreDocument } from '../schemas/store.schema';
import { Product, ProductDocument } from '../schemas/product.schema';
import { User, UserDocument } from '../schemas/user.schema';

import { HttpException, HttpStatus } from '@nestjs/common';
import { TransactionsService } from '../transactions/transactions.service';
import { UpdateTransactionDto } from 'src/transactions/dto/update-transaction';

@Injectable()
export class ProductsService {
  constructor(
    @InjectModel(Store.name) private storeModel: Model<StoreDocument>,
    @InjectModel(Product.name) private productModel: Model<ProductDocument>,
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    private readonly transactionService: TransactionsService,
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

    const productId = String(product._id);

    await this.productModel.findByIdAndUpdate(
      productId,
      {
        $push: { store: storeId },
      },
      { new: true },
    );

    await this.storeModel.findByIdAndUpdate(
      storeId,
      {
        $push: { products: productId },
        $set: { updateAt: new Date() },
      },
      { new: true },
    );

    await this.transactionService.createTransaction(
      {
        type: 'NEW',
        quantity: createProductDto.stock,
        note: `Create product ${product.productName}`,
      },
      productId,
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

  async updateProduct(
    userId: string,
    storeId: string,
    productId: string,
    dto: UpdateProductDto,
  ) {
    return this.productModel.findByIdAndUpdate(
      { _id: productId, store: storeId },
      { ...dto, updateBy: userId, updateAt: new Date() },
      { new: true },
    );
  }

  async updateStock(
    userId: string,
    storeId: string,
    productId: string,
    dto: UpdateTransactionDto,
  ) {
    if (dto.quantity && dto.type) {
      if (dto.type === 'NEW') {
        throw new HttpException('Type cannot be NEW', HttpStatus.BAD_REQUEST);
      }
      const incValue = dto.type === 'OUT' ? -dto.quantity : dto.quantity;
      const message = dto.type === 'OUT' ? 'Decrease' : 'Increase';

      const product = await this.productModel.findByIdAndUpdate(
        { _id: productId, store: storeId },
        {
          $inc: { stock: incValue },
          $set: {
            updateBy: userId,
            updateDate: new Date(),
          },
        },
        { new: true },
      );

      await this.transactionService.createTransaction(
        {
          type: dto.type || '',
          quantity: dto.quantity,
          note: `${product?.productName} product is ${message}`,
        },
        productId,
      );
    }

    return { msg: 'sucess' };
  }
}

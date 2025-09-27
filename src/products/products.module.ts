import { Module } from '@nestjs/common';
import { ProductsService } from './products.service';
import { ProductsController } from './products.controller';
import { StoresService } from '../stores/stores.service';
import { StoresController } from '../stores/stores.controller';
import { UsersService } from '../users/users.service';
import { UsersController } from '../users/users.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Store, StoreSchema } from '../schemas/store.schema';
import { User, UserSchema } from 'src/schemas/user.schema';
import { Product, ProductSchema } from 'src/schemas/product.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Store.name, schema: StoreSchema }]),
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    MongooseModule.forFeature([{ name: Product.name, schema: ProductSchema }]),
  ],
  providers: [UsersService, ProductsService, StoresService],
  controllers: [UsersController, ProductsController, StoresController],
  exports: [UsersService, ProductsService, StoresService, MongooseModule], // << สำคัญ
})
export class ProductsModule {}

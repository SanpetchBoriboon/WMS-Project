import {
  Controller,
  Post,
  Body,
  UseGuards,
  Get,
  Param,
  Patch,
} from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import type { JwtUser } from 'src/auth/types/jwt-user.type';
import { CurrentUser } from 'currentUser';

@Controller('stores/:storeId/products')
@UseGuards(JwtAuthGuard)
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Post()
  create(
    @Param('storeId') storeId: string,
    @Body() createProductDto: CreateProductDto,
    @CurrentUser() user: JwtUser,
  ) {
    const userId = user.userId;
    return this.productsService.create(createProductDto, userId, storeId);
  }

  @Get()
  getAll(@Param('storeId') storeId: string) {
    return this.productsService.getAllProduct(storeId);
  }

  @Patch(':productId')
  updateProduct(
    @Param('storeId') storeId: string,
    @Param('productId') productId: string,
    @Body() updateProductDto: UpdateProductDto,
    @CurrentUser() user: JwtUser,
  ) {
    const userId = user.userId;
    return this.productsService.updateProduct(
      userId,
      storeId,
      productId,
      updateProductDto,
    );
  }
}

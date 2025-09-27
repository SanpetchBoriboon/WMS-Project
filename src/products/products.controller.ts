/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */

import {
  Controller,
  Post,
  Body,
  UseGuards,
  Req,
  Get,
  Param,
} from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
// import { UpdateProductDto } from './dto/update-product.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Post('/:storeId')
  create(
    @Body() createProductDto: CreateProductDto,
    @Req() req: any,
    @Param('storeId') storeId: string,
  ) {
    const userId = req.user.userId || '';
    return this.productsService.create(createProductDto, userId, storeId);
  }

  @Get('/:storeId')
  getAll(@Param('storeId') storeId: string) {
    return this.productsService.getAllProduct(storeId);
  }
}

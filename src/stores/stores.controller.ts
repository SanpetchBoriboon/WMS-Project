import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { StoresService } from './stores.service';
import { CreateStoreDto } from './dto/create-store.dto';
// import { UpdateStoreDto } from './dto/update-store.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CurrentUser } from 'currentUser';
import type { JwtUser } from 'src/auth/types/jwt-user.type';

@Controller('stores')
export class StoresController {
  constructor(private readonly storesService: StoresService) {}

  @UseGuards(JwtAuthGuard)
  @Post('/create')
  create(@Body() createShopDto: CreateStoreDto, @CurrentUser() user: JwtUser) {
    const userId = user.userId;
    return this.storesService.createStore(createShopDto, userId);
  }
}

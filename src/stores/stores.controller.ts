import { Controller, Post, Body, UseGuards, Get } from '@nestjs/common';
import { StoresService } from './stores.service';
import { CreateStoreDto } from './dto/create-store.dto';
// import { UpdateStoreDto } from './dto/update-store.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CurrentUser } from 'src/common/currentUser';
import type { JwtUser } from 'src/auth/types/jwt-user.type';
import { ValidateIdGuard } from '../common/validate-id.guard';

@Controller('stores')
@UseGuards(JwtAuthGuard, ValidateIdGuard)
export class StoresController {
  constructor(private readonly storesService: StoresService) {}

  @Post('/create')
  create(@Body() createShopDto: CreateStoreDto, @CurrentUser() user: JwtUser) {
    const userId = user.userId;
    return this.storesService.createStore(createShopDto, userId);
  }

  @Get()
  getAll(@CurrentUser() user: JwtUser) {
    const userId = user.userId;
    return this.storesService.getStore(userId);
  }
}

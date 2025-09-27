// create-shop.dto.ts
import { IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';

export class CreateStoreDto {
  @IsNotEmpty()
  @IsString()
  storeName: string;

  @IsString()
  @IsOptional()
  address: string;

  @IsString()
  @MaxLength(10)
  @IsOptional()
  tel: string;
}

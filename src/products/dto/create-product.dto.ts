// create-shop.dto.ts
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateProductDto {
  @IsNotEmpty()
  @IsString()
  productName: string;

  @IsNumber()
  stock: number;

  @IsNumber()
  price: string;
}

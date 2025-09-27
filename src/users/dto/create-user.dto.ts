import {
  IsString,
  IsEmail,
  MinLength,
  IsOptional,
  IsEnum,
} from 'class-validator';

export enum UserRole {
  ADMIN = 'ADMIN',
  STAFF = 'STAFF',
}

export class CreateUserDto {
  @IsString()
  username: string;

  @IsString()
  @MinLength(6)
  password: string;

  @IsEnum(UserRole, { message: 'role must be either ADMIN or STAFF' })
  role: UserRole;

  @IsString()
  name: string;

  @IsString()
  @IsOptional()
  lastName: string;

  @IsEmail()
  email: string;

  @IsString()
  @IsOptional()
  tel?: string;

  @IsString()
  @IsOptional()
  address?: string;

  @IsOptional()
  createDate: Date = new Date();
}

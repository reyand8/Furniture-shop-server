import {
    IsArray, IsBoolean, IsNumber, IsOptional,
    IsString, MaxLength, Min
} from 'class-validator';

import { ProductType } from '../../../models/product/product.entity';


export class UpdateProductDto {
    @IsOptional()
    @IsString({ message: 'Product name must be a string.' })
    @MaxLength(100, { message: 'Product name must be at most 100 characters.' })
    name: string;

    @IsOptional()
    @IsString({ message: 'Description must be a string.' })
    @MaxLength(500, { message: 'Description must be at most 500 characters.' })
    description: string;

    @IsOptional()
    @IsNumber({}, { message: 'The price must be a number.' })
    @Min(0, { message: 'The price cannot be negative.' })
    price: number;

    @IsOptional()
    @IsNumber({}, { message: 'Discount price must be a number.' })
    @Min(0, { message: 'Discount price cannot be negative.' })
    discountPrice: number;

    @IsOptional()
    @IsString({ message: 'Currency must be a string.' })
    currency: string;

    @IsOptional()
    @IsArray({ message: 'Images list must be an array.' })
    @IsString({ each: true, message: 'Each image must be a string (URL).' })
    images: string[];

    @IsOptional()
    @IsString({ each: true, message: 'Each size must be a string.' })
    size: string;

    @IsOptional()
    @IsBoolean({ message: 'isAvailable status must be true or false.' })
    isAvailable: boolean = true;

    @IsOptional()
    @IsBoolean({ message: 'isActive status must be true or false.' })
    isActive: boolean;

    @IsOptional()
    @IsBoolean({ message: 'isActive status must be true or false.' })
    isBestSeller: boolean;

    @IsOptional()
    @IsString({ message: 'Category id must be a string.' })
    categoryId: boolean;

    @IsOptional()
    @IsString({ message: 'Color must be a string.' })
    color: string;

    @IsOptional()
    @IsString({
        message:
            `Product type must be a string. Valid values: ${Object.values(ProductType).join(', ')}` })
    type: ProductType;
}

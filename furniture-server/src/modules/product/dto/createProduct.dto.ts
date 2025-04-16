import {
    IsString, IsOptional, IsNumber,
    IsArray, Min, MaxLength, IsUUID, IsBoolean
} from 'class-validator';

import { ProductType } from '../../../models/product/product.entity';


export class CreateProductDto {
    @IsString({ message: 'Product name must be a string.' })
    @MaxLength(100, { message: 'Product name must be at most 100 characters.' })
    name: string;

    @IsOptional()
    @IsString({ message: 'Description must be a string.' })
    @MaxLength(500, { message: 'Description must be at most 500 characters.' })
    description: string;
    @IsString({
        message:
            `Product type must be a string. Valid values: ${Object.values(ProductType).join(', ')}` })
    type: ProductType;

    @IsNumber({}, { message: 'Price must be a number.' })
    @Min(0, { message: 'Price cannot be negative.' })
    price: number;

    @IsOptional()
    @IsNumber({}, { message: 'Discount price must be a number.' })
    @Min(0, { message: 'Discount price cannot be negative.' })
    discountPrice: number;

    @IsString({ message: 'Currency must be a string.' })
    currency: string;

    @IsArray({ message: 'Images list must be an array.' })
    @IsString({ each: true, message: 'Each image must be a string (URL).' })
    images: string[];

    @IsString({ message: 'Each size must be a string.' })
    size: string;

    @IsOptional()
    @IsBoolean()
    isAvailable: boolean = true;

    @IsUUID('4', { message: 'Category ID must be a valid UUID.' })
    categoryId: string;
}
import { IsOptional, IsString, IsNumber, Min } from 'class-validator';
import { Type } from 'class-transformer';


export class GetProductsQueryDto {
    @IsOptional()
    @IsString()
    category?: string;

    @IsOptional()
    @Type((): NumberConstructor => Number)
    @IsNumber()
    @Min(0)
    minPrice?: number;

    @IsOptional()
    @Type((): NumberConstructor => Number)
    @IsNumber()
    @Min(0)
    maxPrice?: number;

    @IsOptional()
    @Type((): NumberConstructor => Number)
    @IsNumber()
    @Min(1)
    page: number = 1;

    @IsOptional()
    @Type((): NumberConstructor => Number)
    @IsNumber()
    @Min(1)
    pageSize: number = 10;
}
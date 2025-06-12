import { IsOptional, IsString, IsNumber, Min } from 'class-validator';
import { Type } from 'class-transformer';
import {IsLessThanOrEqualTo} from "../../../common/decorators/comparison.decorator";


export class GetProductsQueryDto {
    @IsOptional()
    @IsString()
    category?: string;

    @IsOptional()
    @Type((): NumberConstructor => Number)
    @IsNumber()
    @Min(0, { message: 'minPrice cannot be negative' })
    @IsLessThanOrEqualTo('maxPrice', {
        message: 'minPrice must be less than or equal to maxPrice',
    })
    minPrice?: number;

    @IsOptional()
    @Type((): NumberConstructor => Number)
    @IsNumber()
    @Min(0, { message: 'maxPrice cannot be negative' })
    maxPrice?: number;

    @IsOptional()
    @Type((): NumberConstructor => Number)
    @IsNumber()
    @Min(1, { message: 'Page must be greater than 0' })
    @IsLessThanOrEqualTo('pageSize', {
        message: 'Page must be less than or equal to pageSize',
    })
    page: number = 1;

    @IsOptional()
    @Type((): NumberConstructor => Number)
    @IsNumber()
    @Min(1, { message: 'Page size must be greater than 0' })
    pageSize: number = 10;
}
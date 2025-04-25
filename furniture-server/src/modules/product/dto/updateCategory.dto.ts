import {IsBoolean, IsOptional, IsString, MaxLength} from 'class-validator';


export class UpdateCategoryDto {
    @IsOptional()
    @IsString({ message: 'Product name must be a string.' })
    @MaxLength(80, { message: 'Category must be at most 80 characters.' })
    name: string;

    @IsOptional()
    @IsBoolean({ message: 'isActive status must be true or false.' })
    isActive: boolean;
}

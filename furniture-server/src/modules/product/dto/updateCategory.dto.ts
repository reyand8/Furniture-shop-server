import { IsString, MaxLength } from 'class-validator';


export class UpdateCategoryDto {
    @IsString({ message: 'Product name must be a string.' })
    @MaxLength(80, { message: 'Category must be at most 80 characters.' })
    name: string;
}

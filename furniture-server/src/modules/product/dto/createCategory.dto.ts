import { IsNotEmpty, IsString, MaxLength } from 'class-validator';


export class CreateCategoryDto {
    @IsString({ message: 'Category name must be a string.' })
    @MaxLength(80, { message: 'Category must be at most 80 characters.' })
    @IsNotEmpty({message: 'Category name is required'})
    name: string;
}

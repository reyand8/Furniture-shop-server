import {
    Body, Controller, Delete,
    Get, Param, Post, Put
} from '@nestjs/common';

import { ProductService } from './product.service';
import { CreateCategoryDto } from './dto/createCategory.dto';
import { UpdateCategoryDto } from './dto/updateCategory.dto';
import { CategoryEntity } from '../../models/category/category.entity';


@Controller('catalog')
export class ProductController {
    constructor(private readonly productService: ProductService ) {}

    /**
     * Retrieves all categories.
     * @returns {Promise<CategoryEntity[]>} List of all categories.
     */
    @Get('categories')
    async getCategories(): Promise<CategoryEntity[]> {
        return this.productService.getCategories();
    }

    /**
     * Retrieves single category by id.
     * @returns {Promise<CategoryEntity>} Selected category.
     */
    @Get('category/:id')
    async getCategory(@Param('id') id: string): Promise<CategoryEntity> {
        return this.productService.getCategory(id);
    }

    /**
     * Creates a new category.
     * @param {CreateCategoryDto} createCategoryDto - DTO containing the data to create the category.
     * @returns {Promise<CategoryEntity>} The created category.
     */
    @Post('category')
    async createCategory(@Body() createCategoryDto: CreateCategoryDto): Promise<CategoryEntity> {
        return this.productService.createCategory(createCategoryDto.name);
    }

    /**
     * Deletes a category by its ID.
     * @param {string} id - The ID of the category to be deleted.
     * @returns {Promise<void>} A promise indicating the deletion status.
     */
    @Delete('category/:id')
    async deleteCategory(@Param('id') id: string): Promise<void> {
        return this.productService.deleteCategory(id);
    }

    /**
     * Updates a category by its ID.
     * @param {string} id - The ID of the category to be updated.
     * @param {UpdateCategoryDto} updateCategoryDto - DTO containing the updated category data.
     * @returns {Promise<CategoryEntity>} The updated category.
     */
    @Put('category/:id')
    async updateCategory(
        @Param('id') id: string,
        @Body() updateCategoryDto: UpdateCategoryDto
    ): Promise<CategoryEntity> {
        return this.productService.updateCategory(id, updateCategoryDto);
    }
}

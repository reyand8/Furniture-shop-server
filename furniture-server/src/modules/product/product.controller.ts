import {
    Body, Controller, Delete, Get,
    Param, Post, Put, Query, UseGuards
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

import { ProductService } from './product.service';
import { CreateCategoryDto } from './dto/createCategory.dto';
import { UpdateCategoryDto } from './dto/updateCategory.dto';
import { CategoryEntity } from '../../models/category/category.entity';
import { ProductEntity, ProductType } from '../../models/product/product.entity';
import { CreateProductDto } from './dto/createProduct.dto';
import { UpdateProductDto } from './dto/updateProduct.dto';
import { GetProductsQueryDto } from './dto/getProductsQuery.dto';
import { Roles } from '../auth/roles-guard/roles.decorator';
import { EUserRole } from '../../models/user/user.entity';
import { RolesGuard } from '../auth/roles-guard/roles.guard';


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
    @Roles(EUserRole.ADMIN, EUserRole.SUPER_ADMIN)
    @UseGuards(AuthGuard('jwt'), RolesGuard)
    async createCategory(@Body() createCategoryDto: CreateCategoryDto): Promise<CategoryEntity> {
        return this.productService.createCategory(createCategoryDto.name);
    }

    /**
     * Deletes a category by its ID.
     * @param {string} id - The ID of the category to be deleted.
     * @returns {Promise<void>} A promise indicating the deletion status.
     */
    @Delete('category/:id')
    @Roles(EUserRole.ADMIN, EUserRole.SUPER_ADMIN)
    @UseGuards(AuthGuard('jwt'), RolesGuard)
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
    @Roles(EUserRole.ADMIN, EUserRole.SUPER_ADMIN)
    @UseGuards(AuthGuard('jwt'), RolesGuard)
    async updateCategory(
        @Param('id') id: string,
        @Body() updateCategoryDto: UpdateCategoryDto
    ): Promise<CategoryEntity> {
        return this.productService.updateCategory(id, updateCategoryDto);
    }

    /**
     * Retrieves a list of products with optional filters and pagination.
     * @param {GetProductsQueryDto} query - Object containing optional filters:
     *  - category (string): Optional category ID filter.
     *  - minPrice (number): Optional minimum price filter.
     *  - maxPrice (number): Optional maximum price filter.
     *  - page (number): Page number for pagination (default is 1).
     *  - pageSize (number): Number of items per page (default is 10).
     *
     * @returns {Promise<{ products: ProductEntity[], totalPages: number }>}
     * A list of products and the total number of pages based on the filters.
     */
    @Get('products')
    async getProducts(
        @Query() query: GetProductsQueryDto
    ): Promise<{ products: ProductEntity[], totalPages: number }> {
        return this.productService.getProducts(query);
    }

    /**
     * Creates a new product.
     * @param {CreateProductDto} createProductDto - DTO with product data.
     * @returns {Promise<ProductEntity>} The created product.
     */
    @Post('product')
    @Roles(EUserRole.ADMIN, EUserRole.SUPER_ADMIN)
    @UseGuards(AuthGuard('jwt'), RolesGuard)
    async createProduct(@Body() createProductDto: CreateProductDto): Promise<ProductEntity> {
        return this.productService.createProduct(createProductDto);
    }

    /**
     * Updates an existing product by its ID.
     * @param {string} id - Product ID.
     * @param {UpdateProductDto} updateProductDto - DTO with updated data.
     * @returns {Promise<ProductEntity>} The updated product.
     */
    @Put('product/:id')
    @Roles(EUserRole.ADMIN, EUserRole.SUPER_ADMIN)
    @UseGuards(AuthGuard('jwt'), RolesGuard)
    async updateProduct(
        @Param('id') id: string,
        @Body() updateProductDto: UpdateProductDto
    ): Promise<ProductEntity> {
        return this.productService.updateProduct(id, updateProductDto);
    }

    /**
     * Retrieves a single product by ID.
     * @param {string} id - The ID of the product.
     * @returns {Promise<ProductEntity | null>} The requested product.
     */
    @Get('product/:id')
    async getProduct(@Param('id') id: string): Promise<ProductEntity | null> {
        return this.productService.getProductById(id);
    }

    /**
     * Deletes a product by its ID.
     * @param {string} id - The ID of the product to delete.
     * @returns {Promise<void>} A promise indicating the deletion result.
     */
    @Delete('product/:id')
    @Roles(EUserRole.ADMIN, EUserRole.SUPER_ADMIN)
    @UseGuards(AuthGuard('jwt'), RolesGuard)
    async deleteProduct(@Param('id') id: string): Promise<void> {
        return this.productService.deleteProduct(id);
    }

    /**
     * Retrieves products related to a specific type.
     * @param {string} type - The product type to filter by.
     * @returns {Promise<ProductEntity[]>} List of related products.
     */
    @Get('relative-products')
    async getRelativeProducts(@Query('type') type: ProductType): Promise<ProductEntity[]> {
        return this.productService.getRelativeProducts(type);
    }

    /**
     * Searches products by name.
     * @param {string} name - The name (or part of it) to search for.
     * @returns {Promise<ProductEntity[]>} List of products matching the search term.
     */
    @Get('search')
    async searchProductByName(@Query('name') name: string): Promise<ProductEntity[]> {
        return this.productService.searchProductByName(name);
    }

    /**
     * Retrieves top seller products.
     * @returns {Promise<ProductEntity[]>} List of top-selling products.
     */
    @Get('top-products')
    async getTopProducts(): Promise<ProductEntity[]> {
        return this.productService.getTopSellerProducts();
    }
}

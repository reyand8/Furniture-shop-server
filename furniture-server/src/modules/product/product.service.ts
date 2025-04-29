import { Between, LessThanOrEqual, MoreThanOrEqual } from 'typeorm';
import {
    BadRequestException,
    Injectable, NotFoundException
} from '@nestjs/common';

import { CategoryEntity } from '../../models/category/category.entity';
import { ERROR_MESSAGES } from '../common/constants';
import {
    validateDtoFields,
    validateDtoNotEmpty,
    validateProductFilters,
    validateProductType
} from '../common/validation';
import { UpdateCategoryDto } from './dto/updateCategory.dto';
import { ProductEntity, ProductType } from '../../models/product/product.entity';
import { UpdateProductDto } from './dto/updateProduct.dto';
import { CreateProductDto } from './dto/createProduct.dto';
import { GetProductsQueryDto } from './dto/getProductsQuery.dto';
import { IWhereCondition } from './product.interface';
import { CategoryRepository } from './repository/category.repository';
import { ProductRepository } from './repository/product.repository';


const { REQUIRED_CATEGORY_NAME, NOT_FOUND_CATEGORY,
    REQUIRED_PRODUCT_NAME, NOT_FOUND_PRODUCT, EXISTS_CATEGORY_NAME
} = ERROR_MESSAGES;

@Injectable()
export class ProductService {
    constructor(
        private readonly categoryRepository: CategoryRepository,
        private readonly productRepository: ProductRepository
    ) {}

    /**
     * Retrieves all categories from the database.
     *
     * @returns {Promise<CategoryEntity[]>} A list of all categories.
     */
    async getCategories(): Promise<CategoryEntity[]> {
        return this.categoryRepository.findAll();
    }

    /**
     * Retrieves a single category by its ID from the database.
     *
     * @param {string} categoryId - The ID of the category to retrieve.
     * @returns {Promise<CategoryEntity>} The category with the specified ID.
     * @throws {BadRequestException} If the provided ID is invalid.
     */
    async getCategory(categoryId: string): Promise<CategoryEntity> {
        const category: CategoryEntity | null =
            await this.categoryRepository.findById(categoryId);
        if (!category) {
            throw new NotFoundException(NOT_FOUND_CATEGORY);
        }
        return category;
    }

    /**
     * Creates a new category.
     *
     * @param {string} categoryName - The name of the category to be created.
     * @throws {BadRequestException} If the category name is missing.
     */
    async createCategory(categoryName: string): Promise<CategoryEntity> {
        if (!categoryName) {
            throw new BadRequestException(REQUIRED_CATEGORY_NAME);
        }
        const isCatExist: CategoryEntity | null
            = await this.categoryRepository.findByName(categoryName);
        if (isCatExist) {
            throw new BadRequestException(EXISTS_CATEGORY_NAME);
        }
        return this.categoryRepository.createCategory(categoryName);
    }

    /**
     * Updates an existing category by its ID.
     *
     * @param {string} categoryId - The ID of the category to be updated.
     * @param {UpdateCategoryDto} updateCategoryDto - The updated category data.
     *
     * @throws {BadRequestException} If the category ID is invalid.
     */
    async updateCategory(
        categoryId: string,
        updateCategoryDto: UpdateCategoryDto
    ): Promise<CategoryEntity> {
        validateDtoNotEmpty(updateCategoryDto);
        const category: CategoryEntity | null =
            await this.categoryRepository.findById(categoryId);
        if (!category) {
            throw new NotFoundException(NOT_FOUND_CATEGORY);
        }
        const validatedDto: CategoryEntity = validateDtoFields(category, updateCategoryDto);
        return this.categoryRepository.save(validatedDto);
    }

    /**
     * Retrieves a paginated list of products with optional filters for category and price range.
     * Also calculates the total number of pages based on the total count of matched products.
     *
     * @param getProductsQueryDto - DTO containing pagination and filter options
     * @returns An object with the list of products and the total number of pages
     */
    async getProducts(
        getProductsQueryDto: GetProductsQueryDto
    ): Promise<{ products: ProductEntity[], totalPages: number }> {

        const { minPrice, maxPrice, page = 1, pageSize = 10 } = getProductsQueryDto;

        validateProductFilters(page, pageSize, minPrice, maxPrice);

        const skipPage: number = (page - 1) * pageSize;

        const where: IWhereCondition =
            this.buildGetProductWhereCondition(getProductsQueryDto);
        const [products, totalCount] =
            await this.productRepository.findPaginated(where, skipPage, pageSize);
        return { products, totalPages: Math.ceil(totalCount / pageSize) };
    }

    /**
     * Creates a new product based on the provided DTO.
     *
     * @param createProductDto - Data transfer object containing product creation data.
     * @returns The newly created product entity.
     */
    async createProduct(createProductDto: CreateProductDto): Promise<ProductEntity> {
        validateDtoNotEmpty(createProductDto);
        return this.productRepository.createProduct(createProductDto);
    }

    /**
     * Updates an existing product with the provided data.
     *
     * @param productId - The ID of the product to update.
     * @param updateProductDto - Data transfer object containing updated product data.
     * @returns The updated product entity.
     * @throws {BadRequestException} If the product ID is invalid.
     */
    async updateProduct(
        productId: string,
        updateProductDto: UpdateProductDto
    ): Promise<ProductEntity> {
        validateDtoNotEmpty(updateProductDto);
        const product: ProductEntity | null =
            await this.productRepository.findById(productId)
        if (!product) {
            throw new NotFoundException(NOT_FOUND_PRODUCT);
        }
        const validatedDto: ProductEntity = validateDtoFields(product, updateProductDto);
        return this.productRepository.update(validatedDto);
    }

    /**
     * Retrieves a product by its ID, including its category relation.
     *
     * @param productId - The ID of the product to retrieve.
     * @returns The product entity if found, or throws an error if not found.
     */
    async getProductById(productId: string): Promise<ProductEntity | null> {
        const product: ProductEntity | null =
            await this.productRepository.findById(productId)
        if (!product) {
            throw new BadRequestException(NOT_FOUND_PRODUCT);
        }
        return product
    }

    /**
     * Retrieves a list of products of the specified type, ordered by creation date.
     *
     * @param productType - The product type to filter by.
     * @returns A list of products of the specified type.
     */
    async getRelativeProducts(productType: ProductType): Promise<ProductEntity[]> {
        validateProductType(productType);
        return this.productRepository.findByType(productType)
    }

    /**
     * Searches for products by name using a case-insensitive partial match.
     *
     * @param productName - The product name or part of it to search.
     * @returns A list of matching products.
     */
    async searchProductByName(productName: string): Promise<ProductEntity[]> {
        if (!productName) {
            throw new BadRequestException(REQUIRED_PRODUCT_NAME);
        }
        return this.productRepository.searchByName(productName);
    }

    /**
     * Retrieves products marked as bestsellers, ordered by creation date.
     *
     * @returns A list of best-selling products.
     */
    async getTopSellerProducts(): Promise<ProductEntity[]> {
        return await this.productRepository.findTopSellers();
    }

    /**
     * Builds a dynamic "where" condition object for querying products
     * based on optional filters like category and price range.
     *
     * @param getProductsQueryDto - DTO containing query filters (category, minPrice, maxPrice)
     * @returns An object representing the "where" condition for a TypeORM query
     */
    private buildGetProductWhereCondition(
        getProductsQueryDto: GetProductsQueryDto
    ): IWhereCondition {
        const { category, minPrice, maxPrice } = getProductsQueryDto;

        const where: IWhereCondition = {};

        if (category) {
            where.category = { id: category };
        }
        if (minPrice !== undefined && maxPrice !== undefined) {
            where.price = Between(minPrice, maxPrice);
        } else if (minPrice !== undefined) {
            where.price = MoreThanOrEqual(minPrice);
        } else if (maxPrice !== undefined) {
            where.price = LessThanOrEqual(maxPrice);
        }
        return where;
    }
}
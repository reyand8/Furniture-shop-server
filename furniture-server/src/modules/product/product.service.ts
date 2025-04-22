import { Between, LessThanOrEqual, MoreThanOrEqual } from 'typeorm';
import {
    BadRequestException,
    Injectable,
    InternalServerErrorException
} from '@nestjs/common';

import { CategoryEntity } from '../../models/category/category.entity';
import { ERROR_MESSAGES } from '../common/constants';
import {
    validateProvidedId,
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


const { ERROR_SERVER, REQUIRED_CATEGORY_NAME, NOT_FOUND_CATEGORY,
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
     * @throws {InternalServerErrorException} If there's an error during the database query.
     */
    async getCategories(): Promise<CategoryEntity[]> {
        try {
            return this.categoryRepository.findAll();
        } catch (error) {
            throw new InternalServerErrorException(ERROR_SERVER, error.message);
        }
    }

    /**
     * Retrieves a single category by its ID from the database.
     *
     * @param {string} categoryId - The ID of the category to retrieve.
     * @returns {Promise<CategoryEntity>} The category with the specified ID.
     * @throws {BadRequestException} If the provided ID is invalid.
     * @throws {InternalServerErrorException} If the category is not found or
     * if there's an error during the database query.
     */
    async getCategory(categoryId: string): Promise<CategoryEntity> {
        validateProvidedId(categoryId);
        try {
            const category: CategoryEntity | null =
                await this.categoryRepository.findById(categoryId);
            if (!category) {
                throw new InternalServerErrorException(NOT_FOUND_CATEGORY);
            }
            return category;
        } catch (error) {
            throw new InternalServerErrorException(ERROR_SERVER, error.message);
        }
    }

    /**
     * Creates a new category.
     *
     * @param {string} categoryName - The name of the category to be created.
     * @throws {BadRequestException} If the category name is missing.
     * @throws {InternalServerErrorException} If there's an error during the database operation.
     */
    async createCategory(categoryName: string): Promise<CategoryEntity> {
        if (!categoryName) {
            throw new BadRequestException(REQUIRED_CATEGORY_NAME);
        }
        try {
            const isCatExist: CategoryEntity | null
                = await this.categoryRepository.findByName(categoryName);
            if (isCatExist) {
                throw new BadRequestException(EXISTS_CATEGORY_NAME);
            }
            return this.categoryRepository.createCategory(categoryName);
        } catch (error) {
            throw new InternalServerErrorException(ERROR_SERVER, error.message);
        }
    }

    /**
     * Deletes a category by its ID.
     *
     * @param {string} categoryId - The ID of the category to be deleted.
     * @throws {InternalServerErrorException} If there's an error during the deletion process.
     */
    async deleteCategory(categoryId: string): Promise<void> {
        validateProvidedId(categoryId);
        try {
            await this.categoryRepository.removeCategory(categoryId);
        } catch (error) {
            throw new InternalServerErrorException(ERROR_SERVER, error.message);
        }
    }

    /**
     * Updates an existing category by its ID.
     *
     * @param {string} categoryId - The ID of the category to be updated.
     * @param {UpdateCategoryDto} updateCategoryDto - The updated category data.
     *
     * @throws {InternalServerErrorException} If the category is not found or if there's an error during the update process.
     * @throws {BadRequestException} If the category ID is invalid.
     */
    async updateCategory(
        categoryId: string,
        updateCategoryDto: UpdateCategoryDto
    ): Promise<CategoryEntity> {
        validateProvidedId(categoryId);
        validateDtoNotEmpty(updateCategoryDto);
        try {
            const category: CategoryEntity | null =
                await this.categoryRepository.findById(categoryId);
            if (!category) {
                throw new InternalServerErrorException(NOT_FOUND_CATEGORY);
            }
            const validatedDto: CategoryEntity = validateDtoFields(category, updateCategoryDto);
            return this.categoryRepository.save(validatedDto);
        } catch (error) {
            throw new InternalServerErrorException(ERROR_SERVER, error.message);
        }
    }

    /**
     * Retrieves a paginated list of products with optional filters for category and price range.
     * Also calculates the total number of pages based on the total count of matched products.
     *
     * @param getProductsQueryDto - DTO containing pagination and filter options
     * @returns An object with the list of products and the total number of pages
     * @throws {InternalServerErrorException} If an error occurs during the database query
     */
    async getProducts(
        getProductsQueryDto: GetProductsQueryDto
    ): Promise<{ products: ProductEntity[], totalPages: number }> {

        const { minPrice, maxPrice, page = 1, pageSize = 10 } = getProductsQueryDto;

        validateProductFilters(page, pageSize, minPrice, maxPrice);

        const skipPage: number = (page - 1) * pageSize;

        try {
            const where: IWhereCondition =
                this.buildGetProductWhereCondition(getProductsQueryDto);
            const [products, totalCount] =
                await this.productRepository.findPaginated(where, skipPage, pageSize);
            return { products, totalPages: Math.ceil(totalCount / pageSize) };
        } catch (error) {
            throw new InternalServerErrorException(ERROR_SERVER, error.message);
        }
    }

    /**
     * Creates a new product based on the provided DTO.
     *
     * @param createProductDto - Data transfer object containing product creation data.
     * @returns The newly created product entity.
     * @throws {InternalServerErrorException} If there's an error during the database operation.
     */
    async createProduct(createProductDto: CreateProductDto): Promise<ProductEntity> {
        validateDtoNotEmpty(createProductDto);
        try {
            return this.productRepository.createProduct(createProductDto);
        } catch (error) {
            throw new InternalServerErrorException(ERROR_SERVER, error.message);
        }
    }

    /**
     * Updates an existing product with the provided data.
     *
     * @param productId - The ID of the product to update.
     * @param updateProductDto - Data transfer object containing updated product data.
     * @returns The updated product entity.
     * @throws {InternalServerErrorException} If the category is not found or if
     * there's an error during the update process.
     * @throws {BadRequestException} If the product ID is invalid.
     */
    async updateProduct(
        productId: string,
        updateProductDto: UpdateProductDto
    ): Promise<ProductEntity> {
        validateDtoNotEmpty(updateProductDto);
        try {
            const product: ProductEntity | null =
                await this.productRepository.findById(productId)
            if (!product) {
                throw new InternalServerErrorException(NOT_FOUND_PRODUCT);
            }
            const validatedDto: ProductEntity = validateDtoFields(product, updateProductDto);
            return this.productRepository.update(validatedDto);
        } catch (error) {
            throw new InternalServerErrorException(ERROR_SERVER, error.message);
        }
    }

    /**
     * Retrieves a product by its ID, including its category relation.
     *
     * @param productId - The ID of the product to retrieve.
     * @returns The product entity if found, or throws an error if not found.
     * @throws {InternalServerErrorException} If there's an error during the database operation.
     */
    async getProductById(productId: string): Promise<ProductEntity | null> {
        validateProvidedId(productId);
        try {
            const product: ProductEntity | null =
                await this.productRepository.findById(productId)
            if (!product) {
                throw new BadRequestException(NOT_FOUND_PRODUCT);
            }
            return product
        } catch (error) {
            throw new InternalServerErrorException(ERROR_SERVER, error.message);
        }
    }

    /**
     * Deletes a product by its ID.
     *
     * @param productId - The ID of the product to delete.
     * @throws {InternalServerErrorException} If there's an error during the deletion process.
     */
    async deleteProduct(productId: string): Promise<void> {
        validateProvidedId(productId);
        try {
            await this.productRepository.removeProduct(productId)
        } catch (error) {
            throw new InternalServerErrorException(ERROR_SERVER, error.message);
        }
    }

    /**
     * Retrieves a list of products of the specified type, ordered by creation date.
     *
     * @param productType - The product type to filter by.
     * @returns A list of products of the specified type.
     * @throws {InternalServerErrorException} If there's an error during the database operation.
     */
    async getRelativeProducts(productType: ProductType): Promise<ProductEntity[]> {
        validateProductType(productType);
        try {
            return this.productRepository.findByType(productType)
        } catch (error) {
            throw new InternalServerErrorException(ERROR_SERVER, error.message);
        }
    }

    /**
     * Searches for products by name using a case-insensitive partial match.
     *
     * @param productName - The product name or part of it to search.
     * @returns A list of matching products.
     * @throws {InternalServerErrorException} If there's an error during the database operation.
     */
    async searchProductByName(productName: string): Promise<ProductEntity[]> {
        if (!productName) {
            throw new BadRequestException(REQUIRED_PRODUCT_NAME);
        }
        try {
            return this.productRepository.searchByName(productName);
        } catch (error) {
            throw new InternalServerErrorException(ERROR_SERVER, error.message);
        }
    }

    /**
     * Retrieves products marked as bestsellers, ordered by creation date.
     *
     * @returns A list of best-selling products.
     * @throws {InternalServerErrorException} If there's an error during the database operation.
     */
    async getTopSellerProducts(): Promise<ProductEntity[]> {
        try {
            return await this.productRepository.findTopSellers();
        } catch (error) {
            throw new InternalServerErrorException(ERROR_SERVER, error.message);
        }
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
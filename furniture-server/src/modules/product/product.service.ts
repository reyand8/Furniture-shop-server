import { ILike, Repository, SelectQueryBuilder } from 'typeorm';
import { BadRequestException, Injectable,
    InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { CategoryEntity } from '../../models/category/category.entity';
import { ERROR_MESSAGES } from '../common/constants';
import {
    validateCategoryId, validateDtoFields,
    validateDtoNotEmpty, validateProductFilters,
    validateProductId, validateProductType
} from '../common/validation';
import { UpdateCategoryDto } from './dto/updateCategory.dto';
import {ProductEntity, ProductType} from "../../models/product/product.entity";
import {UpdateProductDto} from "./dto/updateProduct.dto";
import {CreateProductDto} from "./dto/createProduct.dto";


const { ERROR_SERVER, REQUIRED_CATEGORY_NAME, NOT_FOUND_CATEGORY,
    REQUIRED_PRODUCT_NAME, NOT_FOUND_PRODUCT } = ERROR_MESSAGES;

@Injectable()
export class ProductService {
    constructor(
      @InjectRepository(CategoryEntity)
      private categoryRepository: Repository<CategoryEntity>,
      @InjectRepository(ProductEntity)
      private productRepository: Repository<ProductEntity>,
    ) {}

    /**
     * Retrieves all categories from the database.
     *
     * @returns {Promise<CategoryEntity[]>} A list of all categories.
     * @throws {InternalServerErrorException} If there's an error during the database query.
     */
    async getCategories(): Promise<CategoryEntity[]> {
        try {
            return await this.categoryRepository.find();
        } catch (error) {
            throw new InternalServerErrorException(ERROR_SERVER, error.message);
        }
    }

    /**
     * Retrieves a single category by its ID from the database.
     *
     * @param {string} id - The ID of the category to retrieve.
     * @returns {Promise<CategoryEntity>} The category with the specified ID.
     * @throws {BadRequestException} If the provided ID is invalid.
     * @throws {InternalServerErrorException} If the category is not found or
     * if there's an error during the database query.
     */
    async getCategory(id: string): Promise<CategoryEntity> {
        validateCategoryId(id);
        try {
            const category: CategoryEntity | null = await this.categoryRepository.findOne({
                where: { id }
            });
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
     * @param {string} name - The name of the category to be created.
     * @throws {BadRequestException} If the category name is missing.
     * @throws {InternalServerErrorException} If there's an error during the database operation.
     */
    async createCategory(name: string): Promise<CategoryEntity> {
        if (!name) {
            throw new BadRequestException(REQUIRED_CATEGORY_NAME);
        }
        try {
            const category: CategoryEntity = this.categoryRepository.create({ name });
            return await this.categoryRepository.save(category);
        } catch (error) {
            throw new InternalServerErrorException(ERROR_SERVER, error.message);
        }
    }

    /**
     * Deletes a category by its ID.
     *
     * @param {string} id - The ID of the category to be deleted.
     * @throws {InternalServerErrorException} If there's an error during the deletion process.
     */
    async deleteCategory(id: string): Promise<void> {
        validateCategoryId(id);
        try {
            await this.categoryRepository.delete(id);
        } catch (error) {
            throw new InternalServerErrorException(ERROR_SERVER, error.message);
        }
    }

    /**
     * Updates an existing category by its ID.
     *
     * @param {string} id - The ID of the category to be updated.
     * @param {UpdateCategoryDto} updateCategoryDto - The updated category data.
     *
     * @throws {InternalServerErrorException} If the category is not found or if there's an error during the update process.
     * @throws {BadRequestException} If the category ID is invalid.
     */
    async updateCategory(id: string, updateCategoryDto: UpdateCategoryDto): Promise<CategoryEntity> {
        validateCategoryId(id);
        validateDtoNotEmpty(updateCategoryDto);
        try {
            const category: CategoryEntity | null =
                await this.categoryRepository.findOne({
                    where: { id }
            });
            if (!category) {
                throw new InternalServerErrorException(NOT_FOUND_CATEGORY);
            }
            const validateDto: CategoryEntity = validateDtoFields(category, updateCategoryDto);
            return await this.categoryRepository.save(validateDto);
        } catch (error) {
            throw new InternalServerErrorException(ERROR_SERVER, error.message);
        }
    }

    /**
     * Retrieves a paginated list of products with optional filtering by category and price range.
     * Also calculates total pages for pagination.
     *
     * @param categoryId - Optional category ID to filter products by category.
     * @param minPrice - Optional minimum price filter.
     * @param maxPrice - Optional maximum price filter.
     * @param page - Page number for pagination (default: 1).
     * @param pageSize - Number of products per page (default: 10).
     * @returns An object containing the list of products and the total number of pages.
     * @throws {InternalServerErrorException} If there's an error during the database query.
     */
    async getProducts (
        categoryId?: string,
        minPrice?: number,
        maxPrice?: number,
        page: number = 1,
        pageSize: number = 10
    ): Promise<{ products: ProductEntity[], totalPages: number }> {
        validateProductFilters(page, pageSize, minPrice, maxPrice);
        const skip: number = (page - 1) * pageSize;
        try {
            const query: SelectQueryBuilder<ProductEntity> =
                this.buildProductQuery(categoryId, minPrice, maxPrice);
            const [products, totalCount] =
                await query.skip(skip).take(pageSize).getManyAndCount();
            return {products, totalPages: Math.ceil(totalCount / pageSize)};
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
            const product: ProductEntity = this.productRepository.create({
                ...createProductDto,
                category: {id: createProductDto.categoryId}
            });
            return await this.productRepository.save(product);
        } catch (error) {
            throw new InternalServerErrorException(ERROR_SERVER, error.message);
        }
    }

    /**
     * Updates an existing product with the provided data.
     *
     * @param id - The ID of the product to update.
     * @param updateProductDto - Data transfer object containing updated product data.
     * @returns The updated product entity.
     * @throws {InternalServerErrorException} If the category is not found or if
     * there's an error during the update process.
     * @throws {BadRequestException} If the product ID is invalid.
     */
    async updateProduct(
        id: string,
        updateProductDto: UpdateProductDto
    ): Promise<ProductEntity> {
        validateDtoNotEmpty(updateProductDto);
        try {
            const product: ProductEntity | null =
                await this.productRepository.findOne({
                    where: { id },
                    relations: ['category'],
                });
            if (!product) {
                throw new InternalServerErrorException(NOT_FOUND_PRODUCT);
            }
            const validateDto: ProductEntity = validateDtoFields(product, updateProductDto);
            return await this.productRepository.save(validateDto);
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
        validateProductId(productId);
        try {
            const product: ProductEntity | null =
                await this.productRepository.findOne({
                where: { id: productId },
                relations: ['category'],
            });
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
     * @param id - The ID of the product to delete.
     * @throws {InternalServerErrorException} If there's an error during the deletion process.
     */
    async deleteProduct(id: string): Promise<void> {
        validateProductId(id);
        try {
            await this.productRepository.delete(id);
        } catch (error) {
            throw new InternalServerErrorException(ERROR_SERVER, error.message);
        }
    }

    /**
     * Retrieves a list of products of the specified type, ordered by creation date.
     *
     * @param type - The product type to filter by.
     * @returns A list of products of the specified type.
     * @throws {InternalServerErrorException} If there's an error during the database operation.
     */
    async getRelativeProducts(type: string): Promise<ProductEntity[]> {
        validateProductType(type);
        try {
            return await this.productRepository.find({
                where: { type: type as ProductType },
                order: { createdAt: 'DESC' },
                relations: ['category'],
            });
        } catch (error) {
            throw new InternalServerErrorException(ERROR_SERVER, error.message);
        }
    }

    /**
     * Searches for products by name using a case-insensitive partial match.
     *
     * @param name - The product name or part of it to search.
     * @returns A list of matching products.
     * @throws {InternalServerErrorException} If there's an error during the database operation.
     */
    async searchProductByName(name: string): Promise<ProductEntity[]> {
        if (!name) {
            throw new BadRequestException(REQUIRED_PRODUCT_NAME);
        }
        try {
            return await this.productRepository.find({
                where: { name: ILike(`%${name}%`), },
                relations: ['category'],
            });
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
            return await this.productRepository.find({
                where: { isBestSeller: true },
                order: { createdAt: 'DESC' },
            });
        } catch (error) {
            throw new InternalServerErrorException(ERROR_SERVER, error.message);
        }
    }

    /**
     * Builds a query for fetching products with optional filters for category and price range.
     * Also joins the category relation to include category data in the results.
     *
     * @param categoryId - Optional category ID to filter products.
     * @param minPrice - Optional minimum price filter.
     * @param maxPrice - Optional maximum price filter.
     * @returns A SelectQueryBuilder instance for the product entity.
     */
    private buildProductQuery(
        categoryId?: string,
        minPrice?: number,
        maxPrice?: number
    ): SelectQueryBuilder<ProductEntity> {

        const query: SelectQueryBuilder<ProductEntity> =
            this.productRepository
                .createQueryBuilder('product')
                .leftJoinAndSelect('product.category', 'category');

        if (categoryId != null) {
            query.andWhere('product.categoryId = :categoryId', { categoryId });
        }

        if (minPrice != null) {
            query.andWhere('product.price >= :minPrice', { minPrice });
        }

        if (maxPrice != null) {
            query.andWhere('product.price <= :maxPrice', { maxPrice });
        }
        return query;
    }
}
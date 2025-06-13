import { Between, LessThanOrEqual, MoreThanOrEqual } from 'typeorm';
import {
    BadRequestException,
    Injectable, NotFoundException
} from '@nestjs/common';

import { CategoryEntity } from '../../models/category/category.entity';
import { ERROR_MESSAGES } from '../../common/constants';
import {
    updateEntityWithDto,
    validateDtoNotEmpty,
    validateProductType
} from '../../common/validation';
import { UpdateCategoryDto } from './dto/updateCategory.dto';
import { ProductEntity, ProductType } from '../../models/product/product.entity';
import { UpdateProductDto } from './dto/updateProduct.dto';
import { CreateProductDto } from './dto/createProduct.dto';
import { GetProductsQueryDto } from './dto/getProductsQuery.dto';
import { IWhereCondition } from './product.interface';
import { CategoryRepository } from './repository/category.repository';
import { ProductRepository } from './repository/product.repository';


const {
    REQUIRED_CATEGORY_NAME,
    NOT_FOUND_CATEGORY,
    REQUIRED_PRODUCT_NAME,
    NOT_FOUND_PRODUCT,
    EXISTS_CATEGORY_NAME,
    NOT_FOUND_PRODUCT_IDS
} = ERROR_MESSAGES;

@Injectable()
export class ProductService {
    constructor(
        private readonly categoryRepository: CategoryRepository,
        private readonly productRepository: ProductRepository
    ) {}

    /**
     * Retrieves all categories from the database.
     * If the user is not an admin, only active categories are returned.
     *
     * @param isAdmin - Whether the requester has admin privileges.
     * @returns {Promise<CategoryEntity[]>} A promise resolving to a list of categories.
     */
    async getCategories(isAdmin: boolean): Promise<CategoryEntity[]> {
        return this.categoryRepository.findAll(isAdmin);
    }

    /**
     * Retrieves a single category by its ID from the database.
     * If the user is not an admin, only active categories can be retrieved.
     *
     * @param {string} categoryId - The ID of the category to retrieve.
     * @param {boolean} isAdmin - Whether the requester has admin privileges.
     * @returns {Promise<CategoryEntity>} A promise resolving to the category with the specified ID.
     * @throws {NotFoundException} If no category is found with the given ID.
     */
    async getCategory(categoryId: string, isAdmin: boolean): Promise<CategoryEntity> {
        const category = await this.categoryRepository.findById(categoryId, isAdmin);
        if (!category) {
            throw new NotFoundException(NOT_FOUND_CATEGORY);
        }
        return category;
    }

    /**
     * Creates a new category with the given name.
     * Validates that the category name is provided and does not already exist.
     *
     * @param {string} categoryName - The name of the category to be created.
     * @returns {Promise<CategoryEntity>} A promise resolving to the newly created category entity.
     *
     * @throws {BadRequestException} If the category name is missing or already exists.
     */
    async createCategory(categoryName: string): Promise<CategoryEntity> {
        if (!categoryName) {
            throw new BadRequestException(REQUIRED_CATEGORY_NAME);
        }
        const isAdmin = true;
        const isCatExist = await this.categoryRepository.findByName(categoryName, isAdmin);
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
        const isAdmin = true;
        const category = await this.categoryRepository.findById(categoryId, isAdmin);
        if (!category) {
            throw new NotFoundException(NOT_FOUND_CATEGORY);
        }
        const validatedDto: CategoryEntity = updateEntityWithDto(category, updateCategoryDto);
        return this.categoryRepository.save(validatedDto);
    }

    /**
     * Retrieves paginated products based on filters.
     *
     * @param getProductsQueryDto - Filtering and pagination parameters.
     * @param isAdmin - Admin status flag.
     * @returns Products list and total page count.
     */
    async getProducts(
        getProductsQueryDto: GetProductsQueryDto,
        isAdmin: boolean
    ): Promise<{ products: ProductEntity[], totalPages: number }> {
        const { page = 1, pageSize = 10 } = getProductsQueryDto;

        const skipPage: number = (page - 1) * pageSize;

        const where: IWhereCondition =
            this.buildGetProductWhereCondition(getProductsQueryDto);
        const [products, totalCount] =
            await this.productRepository.findPaginated(where, skipPage, pageSize, isAdmin);
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
        const isAdmin = true;
        const product: ProductEntity | null =
            await this.productRepository.findById(productId, isAdmin)
        if (!product) {
            throw new NotFoundException(NOT_FOUND_PRODUCT);
        }
        const validatedDto: ProductEntity = updateEntityWithDto(product, updateProductDto);
        return this.productRepository.update(validatedDto);
    }

    /**
     * Retrieves a product by its ID, including its category.
     * Throws an error if the product is not found.
     *
     * @param productId - ID of the product to retrieve.
     * @param isAdmin - Whether the requester has admin privileges.
     * @returns The found product entity.
     * @throws BadRequestException if the product does not exist.
     */
    async getProductById(productId: string, isAdmin: boolean): Promise<ProductEntity | null> {
        const product: ProductEntity | null =
            await this.productRepository.findById(productId, isAdmin)
        if (!product) {
            throw new BadRequestException(NOT_FOUND_PRODUCT);
        }
        return product
    }

    /**
     * Retrieves products by their IDs.
     * Throws a BadRequestException if the input array is empty or undefined.
     *
     * @param productIds - Array of product IDs to fetch.
     * @param isAdmin - Flag indicating if the requester has admin privileges.
     * @returns Promise resolving to an array of matching ProductEntity instances.
     * @throws BadRequestException if productIds is empty or undefined.
     */
    async getProductByIds(productIds: string[], isAdmin: boolean): Promise<ProductEntity[]> {
        if (!productIds || productIds.length === 0) {
            throw new BadRequestException(NOT_FOUND_PRODUCT_IDS);
        }
        return this.productRepository.findProductsByIds(productIds, isAdmin);
    }

    /**
     * Retrieves products of the specified type, ordered by creation date.
     *
     * @param productType - Type of products to retrieve.
     * @param isAdmin - Whether the requester has admin privileges.
     * @returns A promise resolving to an array of products matching the type.
     */
    async getRelativeProducts(productType: ProductType, isAdmin: boolean): Promise<ProductEntity[]> {
        validateProductType(productType);
        return this.productRepository.findByType(productType, isAdmin)
    }

    /**
     * Searches for products by name using a case-insensitive partial match.
     * Throws an error if no product name is provided.
     *
     * @param productName - The product name or a part of it to search for.
     * @param isAdmin - Whether the requester is an admin (may affect filtering or visibility).
     * @returns A promise resolving to a list of matching products.
     * @throws BadRequestException if the product name is empty.
     */
    async searchProductByName(productName: string, isAdmin: boolean): Promise<ProductEntity[]> {
        if (!productName) {
            throw new BadRequestException(REQUIRED_PRODUCT_NAME);
        }
        return this.productRepository.searchByName(productName, isAdmin);
    }

    /**
     * Retrieves products marked as bestsellers, ordered by creation date.
     *
     * @returns A list of best-selling products.
     */
    async getTopSellerProducts(isAdmin: boolean): Promise<ProductEntity[]> {
        return await this.productRepository.findTopSellers(isAdmin);
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
        if (typeof minPrice === 'number' && typeof maxPrice === 'number') {
            where.price = Between(minPrice, maxPrice);
        } else if (typeof minPrice === 'number') {
            where.price = MoreThanOrEqual(minPrice);
        } else if (typeof maxPrice === 'number') {
            where.price = LessThanOrEqual(maxPrice);
        }
        return where;
    }
}
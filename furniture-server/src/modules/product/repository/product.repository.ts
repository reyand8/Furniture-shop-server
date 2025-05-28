import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { ProductEntity, ProductType } from '../../../models/product/product.entity';
import { IWhereCondition } from '../product.interface';
import { CreateProductDto } from '../dto/createProduct.dto';


@Injectable()
export class ProductRepository {
    constructor(
        @InjectRepository(ProductEntity)
        private readonly productRepo: Repository<ProductEntity>,
    ) {}

    /**
     * Retrieves a paginated list of products with optional filtering and category relation.
     * If the user is not an admin, only active products and categories are included.
     *
     * @param where - Filtering conditions to apply to the query.
     * @param skip - Number of records to skip (for pagination).
     * @param take - Number of records to return (for pagination).
     * @param isAdmin - Whether the requester has admin privileges.
     * @returns A promise resolving to a tuple: [list of products, total count].
     */
    async findPaginated(
        where: IWhereCondition,
        skip: number,
        take: number,
        isAdmin: boolean,
    ): Promise<[ProductEntity[], number]> {
        const query = this.productRepo
            .createQueryBuilder('product')
            .leftJoinAndSelect('product.category', 'category')
            .where(where)
            .orderBy('product.createdAt', 'DESC')
            .skip(skip)
            .take(take);

        if (!isAdmin) {
            query.andWhere('product.isActive = true')
                .andWhere('category.isActive = true');
        }
        const [products, count] = await query.getManyAndCount();
        return [products, count];
    }

    /**
     * Creates and saves a new product entity.
     * @param createProductDto - DTO containing product data.
     * @returns A promise resolving to the created ProductEntity.
     */
    async createProduct(createProductDto: CreateProductDto): Promise<ProductEntity> {
        const product: ProductEntity = this.productRepo.create({
            ...createProductDto,
            category: { id: createProductDto.categoryId }
        });
        return this.productRepo.save(product);
    }

    /**
     * Finds a product by its ID, including its category relation.
     * If the user is not an admin, only active products and categories are considered.
     *
     * @param productId - The ID of the product to retrieve.
     * @param isAdmin - Whether the requester has admin privileges.
     * @returns A promise resolving to the ProductEntity if found, or null otherwise.
     */
    async findById(productId: string, isAdmin: boolean): Promise<ProductEntity | null> {
        const query = this.productRepo
            .createQueryBuilder('product')
            .leftJoinAndSelect('product.category', 'category')
            .where('product.id = :id', { id: productId });
        if (!isAdmin) {
            query.andWhere('product.isActive = true')
                .andWhere('category.isActive = true');
        }
        return query.getOne();
    }

    /**
     * Updates and saves an existing product entity.
     * @param product - The product entity to update.
     * @returns A promise resolving to the updated ProductEntity.
     */
    async update(product: ProductEntity): Promise<ProductEntity> {
        return this.productRepo.save(product);
    }

    /**
     * Retrieves all products of a specific type.
     * If the user is not an admin, only active products and categories are returned.
     *
     * @param type - The type of products to retrieve.
     * @param isAdmin - Whether the requester has admin privileges.
     * @returns A promise resolving to an array of ProductEntity objects matching the type.
     */
    async findByType(type: ProductType, isAdmin: boolean): Promise<ProductEntity[]> {
        const query = this.productRepo.createQueryBuilder('product')
            .leftJoinAndSelect('product.category', 'category')
            .where('product.type = :type', { type });
        if (!isAdmin) {
            query.andWhere('product.isActive = true')
                .andWhere('category.isActive = true');
        }
        return query.orderBy('product.createdAt', 'DESC').getMany();
    }

    /**
     * Searches for products by name using a case-insensitive match.
     * @param productName - The name to search for.
     * @param isAdmin - Whether the requester is an admin.
     * @returns A promise resolving to an array of ProductEntity.
     */
    async searchByName(productName: string, isAdmin: boolean): Promise<ProductEntity[]> {
        const query = this.productRepo.createQueryBuilder('product')
            .leftJoinAndSelect('product.category', 'category')
            .where('product.name ILIKE :name', { name: `%${productName}%` });
        if (!isAdmin) {
            query.andWhere('product.isActive = true')
                .andWhere('category.isActive = true');
        }
        return query.orderBy('product.createdAt', 'DESC').getMany();
    }

    /**
     * Retrieves top-selling products.
     * @param isAdmin - Whether the requester is an admin.
     * @returns A promise resolving to an array of ProductEntity.
     */
    async findTopSellers(isAdmin: boolean): Promise<ProductEntity[]> {
        const query = this.productRepo.createQueryBuilder('product')
            .leftJoinAndSelect('product.category', 'category')
            .where('product.isBestSeller = true');
        if (!isAdmin) {
            query.andWhere('product.isActive = true')
                .andWhere('category.isActive = true');
        }
        return query.orderBy('product.createdAt', 'DESC').getMany();
    }

    /**
     * Retrieves products by their IDs.
     * @param productIds - An array of product IDs to find.
     * @param isAdmin - Whether the requester is an admin.
     * @returns A promise that resolves to an array of found ProductEntity objects.
     */
    async findProductsByIds(productIds: string[], isAdmin: boolean): Promise<ProductEntity[]> {
        const query = this.productRepo.createQueryBuilder('product')
            .leftJoinAndSelect('product.category', 'category')
            .whereInIds(productIds);
        if (!isAdmin) {
            query.andWhere('product.isActive = true')
                .andWhere('category.isActive = true');
        }
        return query.getMany();
    }
}

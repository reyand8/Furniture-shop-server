import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, ILike, In, Repository } from 'typeorm';

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
     * Retrieves paginated products with filtering and relations.
     * @param where - Filtering conditions.
     * @param skip - Number of records to skip.
     * @param take - Number of records to return.
     * @returns A promise resolving to a tuple of products and total count.
     */
    findPaginated(
        where: IWhereCondition,
        skip: number,
        take: number,
    ): Promise<[ProductEntity[], number]> {
        return this.productRepo.findAndCount({
            where,
            relations: ['category'],
            skip,
            take,
            order: { createdAt: 'DESC' },
        });
    }

    /**
     * Creates and saves a new product entity.
     * @param createProductDto - DTO containing product data.
     * @returns A promise resolving to the created ProductEntity.
     */
    createProduct(createProductDto: CreateProductDto): Promise<ProductEntity> {
        const product: ProductEntity = this.productRepo.create({
            ...createProductDto,
            category: { id: createProductDto.categoryId }
        });
        return this.productRepo.save(product);
    }

    /**
     * Finds a product by its ID.
     * @param id - The ID of the product.
     * @returns A promise resolving to the ProductEntity or null if not found.
     */
    findById(id: string): Promise<ProductEntity | null> {
        return this.productRepo.findOne({
            where: { id },
            relations: ['category'],
        });
    }

    /**
     * Updates and saves an existing product entity.
     * @param product - The product entity to update.
     * @returns A promise resolving to the updated ProductEntity.
     */
    update(product: ProductEntity): Promise<ProductEntity> {
        return this.productRepo.save(product);
    }

    /**
     * Deletes a product by its ID.
     * @param productId - The ID of the product to delete.
     * @returns A promise resolving to the result of the deletion.
     */
    removeProduct(productId: string): Promise<DeleteResult> {
        return this.productRepo.delete(productId);
    }

    /**
     * Finds products by their type.
     * @param type - The type of the products.
     * @returns A promise resolving to an array of ProductEntity.
     */
    findByType(type: ProductType): Promise<ProductEntity[]> {
        return this.productRepo.find({
            where: { type },
            relations: ['category'],
            order: { createdAt: 'DESC' },
        });
    }

    /**
     * Searches for products by name using a case-insensitive match.
     * @param productName - The name to search for.
     * @returns A promise resolving to an array of ProductEntity.
     */
    searchByName(productName: string): Promise<ProductEntity[]> {
        return this.productRepo.find({
            where: { name: ILike(`%${productName}%`) },
            relations: ['category'],
        });
    }

    /**
     * Retrieves products marked as bestsellers.
     * @returns A promise resolving to an array of ProductEntity.
     */
    findTopSellers(): Promise<ProductEntity[]> {
        return this.productRepo.find({
            where: { isBestSeller: true },
            relations: ['category'],
            order: { createdAt: 'DESC' },
        });
    }

    /**
     * Retrieves products by their IDs.
     * @param productIds - An array of product IDs to find.
     * @returns A promise that resolves to an array of found ProductEntity objects.
     */
    findProductsByIds(productIds: string[]): Promise<ProductEntity[]> {
        return this.productRepo.find({
            where: { id: In(productIds)}
        });
    }
}

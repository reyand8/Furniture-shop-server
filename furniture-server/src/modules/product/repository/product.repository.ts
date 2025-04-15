import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {DeleteResult, ILike, Repository} from 'typeorm';

import { ProductEntity, ProductType } from '../../../models/product/product.entity';
import { IWhereCondition } from '../product.interface';
import { CreateProductDto } from '../dto/createProduct.dto';


@Injectable()
export class ProductRepository {
    constructor(
        @InjectRepository(ProductEntity)
        private readonly repository: Repository<ProductEntity>,
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
        return this.repository.findAndCount({
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
        const product: ProductEntity = this.repository.create({
            ...createProductDto,
            category: { id: createProductDto.categoryId }
        });
        return this.repository.save(product);
    }

    /**
     * Finds a product by its ID.
     * @param id - The ID of the product.
     * @returns A promise resolving to the ProductEntity or null if not found.
     */
    findById(id: string): Promise<ProductEntity | null> {
        return this.repository.findOne({
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
        return this.repository.save(product);
    }

    /**
     * Deletes a product by its ID.
     * @param id - The ID of the product to delete.
     * @returns A promise resolving to the result of the deletion.
     */
    deleteById(id: string): Promise<DeleteResult> {
        return this.repository.delete(id);
    }

    /**
     * Finds products by their type.
     * @param type - The type of the products.
     * @returns A promise resolving to an array of ProductEntity.
     */
    findByType(type: ProductType): Promise<ProductEntity[]> {
        return this.repository.find({
            where: { type },
            relations: ['category'],
            order: { createdAt: 'DESC' },
        });
    }

    /**
     * Searches for products by name using a case-insensitive match.
     * @param name - The name to search for.
     * @returns A promise resolving to an array of ProductEntity.
     */
    searchByName(name: string): Promise<ProductEntity[]> {
        return this.repository.find({
            where: { name: ILike(`%${name}%`) },
            relations: ['category'],
        });
    }

    /**
     * Retrieves products marked as bestsellers.
     * @returns A promise resolving to an array of ProductEntity.
     */
    findTopSellers(): Promise<ProductEntity[]> {
        return this.repository.find({
            where: { isBestSeller: true },
            relations: ['category'],
            order: { createdAt: 'DESC' },
        });
    }
}

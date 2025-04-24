import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { DeleteResult, Repository } from 'typeorm';
import { CategoryEntity } from '../../../models/category/category.entity';


@Injectable()
export class CategoryRepository {
    constructor(
        @InjectRepository(CategoryEntity)
        private readonly categoryRepo: Repository<CategoryEntity>,
    ) {}

    /**
     * Retrieves all categories from the database.
     * @returns A promise that resolves to an array of CategoryEntity objects.
     */
    async findAll(): Promise<CategoryEntity[]> {
        return this.categoryRepo.find();
    }

    /**
     * Finds a category by its unique ID.
     * @param categoryId - The ID of the category.
     * @returns A promise that resolves to a CategoryEntity or null if not found.
     */
    async findById(categoryId: string): Promise<CategoryEntity | null> {
        return this.categoryRepo.findOne({ where: { id: categoryId } });
    }

    /**
     * Finds a category by its name.
     * @param categoryName - The name of the category.
     * @returns A promise that resolves to a CategoryEntity or null if not found.
     */
    async findByName(categoryName: string): Promise<CategoryEntity | null> {
        return this.categoryRepo.findOne({ where: { name: categoryName } });
    }

    /**
     * Creates and saves a new category with the given name.
     * @param categoryName - The name of the new category.
     * @returns A promise that resolves to the created CategoryEntity.
     */
    async createCategory(categoryName: string): Promise<CategoryEntity> {
        const category: CategoryEntity = this.categoryRepo.create({ name: categoryName });
        return this.categoryRepo.save(category);
    }

    /**
     * Deletes a category by its ID.
     * @param categoryId - The ID of the category to delete.
     * @returns A promise that resolves to the result of the deletion.
     */
    async removeCategory(categoryId: string): Promise<DeleteResult> {
        return this.categoryRepo.delete(categoryId);
    }

    /**
     * Saves changes made to a category entity.
     * @param category - The category entity to save.
     * @returns A promise that resolves to the updated CategoryEntity.
     */
    async save(category: CategoryEntity): Promise<CategoryEntity> {
        return this.categoryRepo.save(category);
    }
}

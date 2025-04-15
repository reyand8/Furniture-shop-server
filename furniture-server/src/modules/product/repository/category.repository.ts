import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { DeleteResult, Repository } from 'typeorm';
import { CategoryEntity } from '../../../models/category/category.entity';


@Injectable()
export class CategoryRepository {
    constructor(
        @InjectRepository(CategoryEntity)
        private readonly repository: Repository<CategoryEntity>,
    ) {}

    /**
     * Retrieves all categories from the database.
     * @returns A promise that resolves to an array of CategoryEntity objects.
     */
    findAll(): Promise<CategoryEntity[]> {
        return this.repository.find();
    }

    /**
     * Finds a category by its unique ID.
     * @param id - The ID of the category.
     * @returns A promise that resolves to a CategoryEntity or null if not found.
     */
    findById(id: string): Promise<CategoryEntity | null> {
        return this.repository.findOne({ where: { id } });
    }

    /**
     * Finds a category by its name.
     * @param name - The name of the category.
     * @returns A promise that resolves to a CategoryEntity or null if not found.
     */
    findByName(name: string): Promise<CategoryEntity | null> {
        return this.repository.findOne({ where: { name } });
    }

    /**
     * Creates and saves a new category with the given name.
     * @param name - The name of the new category.
     * @returns A promise that resolves to the created CategoryEntity.
     */
    createCategory(name: string): Promise<CategoryEntity> {
        const category: CategoryEntity = this.repository.create({ name });
        return this.repository.save(category);
    }

    /**
     * Deletes a category by its ID.
     * @param id - The ID of the category to delete.
     * @returns A promise that resolves to the result of the deletion.
     */
    deleteById(id: string): Promise<DeleteResult> {
        return this.repository.delete(id);
    }

    /**
     * Saves changes made to a category entity.
     * @param category - The category entity to save.
     * @returns A promise that resolves to the updated CategoryEntity.
     */
    save(category: CategoryEntity): Promise<CategoryEntity> {
        return this.repository.save(category);
    }
}

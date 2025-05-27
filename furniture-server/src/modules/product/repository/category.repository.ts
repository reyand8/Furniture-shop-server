import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, FindOptionsWhere } from 'typeorm';
import { CategoryEntity } from '../../../models/category/category.entity';

@Injectable()
export class CategoryRepository {
    constructor(
        @InjectRepository(CategoryEntity)
        private readonly categoryRepo: Repository<CategoryEntity>,
    ) {}

    /**
     * Retrieves all categories, optionally filtered by active status for non-admins.
     * @param isAdmin - if true, returns all categories; otherwise only active ones.
     */
    async findAll(isAdmin: boolean): Promise<CategoryEntity[]> {
        const whereCondition: FindOptionsWhere<CategoryEntity> = isAdmin ? {} : { isActive: true };
        return this.categoryRepo.find({ where: whereCondition });
    }

    /**
     * Finds a category by ID. Non-admins get only active categories.
     * @param categoryId - ID of the category.
     * @param isAdmin - if true, returns category regardless of active status.
     */
    async findById(categoryId: string, isAdmin: boolean): Promise<CategoryEntity | null> {
        const whereCondition: FindOptionsWhere<CategoryEntity> = isAdmin
            ? { id: categoryId }
            : { id: categoryId, isActive: true };
        return this.categoryRepo.findOne({ where: whereCondition });
    }

    /**
     * Finds a category by name. Non-admins get only active categories.
     * @param categoryName - Name of the category.
     * @param isAdmin - if true, returns category regardless of active status.
     */
    async findByName(categoryName: string, isAdmin: boolean): Promise<CategoryEntity | null> {
        const whereCondition: FindOptionsWhere<CategoryEntity> = isAdmin
            ? { name: categoryName }
            : { name: categoryName, isActive: true };
        return this.categoryRepo.findOne({ where: whereCondition });
    }

    /**
     * Creates and saves a new category.
     * @param categoryName - Name of the new category.
     */
    async createCategory(categoryName: string): Promise<CategoryEntity> {
        const category: CategoryEntity = this.categoryRepo.create({ name: categoryName });
        return this.categoryRepo.save(category);
    }

    /**
     * Saves changes made to a category entity.
     * @param category - The category entity to save.
     */
    async save(category: CategoryEntity): Promise<CategoryEntity> {
        return this.categoryRepo.save(category);
    }
}

import { Repository } from 'typeorm';
import { BadRequestException, Injectable,
    InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { CategoryEntity } from '../../models/category/category.entity';
import { ERROR_MESSAGES } from '../common/constants';
import {
    validateCategoryId,
    validateDtoFields,
    validateDtoNotEmpty } from '../common/validation';
import { UpdateCategoryDto } from './dto/updateCategory.dto';


const { ERROR_SERVER, REQUIRED_CATEGORY_NAME, NOT_FOUND_CATEGORY } = ERROR_MESSAGES;

@Injectable()
export class ProductService {
    constructor(
      @InjectRepository(CategoryEntity)
      private categoryRepository: Repository<CategoryEntity>,
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
}
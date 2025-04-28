import { BadRequestException, ForbiddenException, NotFoundException } from '@nestjs/common';

import { ERROR_MESSAGES } from './constants';
import { ProductType } from '../../models/product/product.entity';
import { EUserRole } from '../../models/user/user.entity';


const {
    REQUIRED_PRODUCT_TYPE,
    NOT_FOUND_DTO,
    INVALID_PRODUCT_TYPE,
    INVALID_PAGE,
    INVALID_PAGE_SIZE,
    PAGE_GREATER_THAN_SIZE,
    FORBIDDEN_ACCESS
} = ERROR_MESSAGES

/**
 * Updates fields of an entity using a DTO, excluding
 * forbidden fields like password, id, and role.
 *
 * @param entity - The entity to update
 * @param updateDto - The DTO containing fields to update
 * @param forbiddenFields - Array of field names that should not be updated
 */
export function validateDtoFields<T>(
    entity: T,
    updateDto: Partial<T>,
    forbiddenFields: string[] = []
): T {
    const updatedEntity = { ...entity };
    for (const key in updateDto) {
        if (updateDto[key] !== undefined && !forbiddenFields.includes(key)) {
            updatedEntity[key] = updateDto[key];
        }
    }
    return updatedEntity;
}

/**
 * Validates that the provided DTO is not null, undefined, or an empty object.
 * Throws NotFoundException if the DTO is missing or contains no fields.
 *
 * @param dto - The DTO object to validate.
 * @throws NotFoundException - If the DTO is empty or not provided.
 */
export function validateDtoNotEmpty<T>(dto: T): void {
    if (!dto || !Object.keys(dto).length) {
        throw new NotFoundException(NOT_FOUND_DTO);
    }
}

/**
 * Validates the provided product type.
 * Throws an exception if the type is missing or invalid.
 *
 * @param type - The product type to validate.
 *
 * @throws {BadRequestException} If the product type is not provided.
 * @throws {BadRequestException} If the product type is not in ProductType.
 */
export function validateProductType(type: string): void {
    if (!type) {
        throw new BadRequestException(REQUIRED_PRODUCT_TYPE);
    }
    if (!Object.values(ProductType).includes(type as ProductType)) {
        throw new BadRequestException(INVALID_PRODUCT_TYPE);
    }
}

/**
 * Validates filters for product queries, including price range and pagination.
 *
 * @param page - The current page number.
 * @param pageSize - The number of items per page.
 * @param minPrice - Optional minimum price.
 * @param maxPrice - Optional maximum price.
 */
export function validateProductFilters(
    page: number,
    pageSize: number,
    minPrice?: number,
    maxPrice?: number,
): void {
    if (minPrice !== undefined) {
        validatePrice('minPrice', minPrice);
    }
    if (maxPrice !== undefined) {
        validatePrice('maxPrice', maxPrice);
    }
    validatePages(page, pageSize);
}

/**
 * Validates a given price value.
 * Ensures it is a non-negative number.
 *
 * @param type - The name of the price field (e.g., "minPrice").
 * @param value - The price value to validate.
 */
export function validatePrice(type: string, value: number): void {
    if (isNaN(value)) {
        throw new BadRequestException(`${type} must be a number`);
    }
    if (value < 0) {
        throw new BadRequestException(`${type} cannot be negative`);
    }
}

/**
 * Validates pagination parameters.
 * Ensures both page and pageSize are greater than 0, and page is not greater than pageSize.
 *
 * @param page - The current page number.
 * @param pageSize - The number of items per page.
 */
export function validatePages(page: number, pageSize: number): void {
    if (page < 1) {
        throw new BadRequestException(INVALID_PAGE);
    }
    if (pageSize < 1) {
        throw new BadRequestException(INVALID_PAGE_SIZE);
    }
    if (page > pageSize) {
        throw new BadRequestException(PAGE_GREATER_THAN_SIZE);
    }
}

/**
 * Validates if the user's role is SUPER_ADMIN.
 * Throws a ForbiddenException if the user is not a SUPER_ADMIN.
 *
 * @param role - Role of the user to validate.
 */
export function validateIsSuperAdmin(role: EUserRole): void {
    if (role !== EUserRole.SUPER_ADMIN) {
        throw new ForbiddenException(FORBIDDEN_ACCESS);
    }
}

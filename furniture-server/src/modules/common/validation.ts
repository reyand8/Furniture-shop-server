import { BadRequestException, NotFoundException } from '@nestjs/common';

import { ERROR_MESSAGES, UUID_REGEX } from './constants';
import { ProductType } from '../../models/product/product.entity';


const {
    REQUIRED_USER_ID, INVALID_USER_ID,
    REQUIRED_USER_ID_AND_CONTACT_INFO_ID,
    INVALID_CONTACT_INFO_ID,
    REQUIRED_CATEGORY_ID,
    INVALID_CATEGORY_ID,
    REQUIRED_PRODUCT_TYPE,
    REQUIRED_PRODUCT_ID,
    INVALID_PRODUCT_ID,
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
        if (updateDto[key] && !forbiddenFields.includes(key)) {
            updatedEntity[key] = updateDto[key];
        }
    }
    return updatedEntity;
}

/**
 * Validates a UUID format using a regular expression.
 *
 * @param uuid - The UUID string to validate
 * @returns True if the UUID format is valid, otherwise false
 */
export function validateUUID(uuid: string): boolean {
    return UUID_REGEX.test(uuid);
}

/**
 * Validates that the provided DTO is not null, undefined, or an empty object.
 * Throws NotFoundException if the DTO is missing or contains no fields.
 *
 * @param userDto - The DTO object to validate (UpdateUserDto or CreateContactInfoDto).
 * @throws NotFoundException - If the DTO is empty or not provided.
 */
export function validateDtoNotEmpty<T>(userDto: T): void {
    if (!userDto || Object.keys(userDto).length === 0) {
        throw new NotFoundException('DTO is empty or not found');
    }
}

/**
 * Validates the userId and throws BadRequestException if invalid.
 *
 * @param userId - The ID of the user to validate
 */
export function validateUserId(userId: string): void {
    if (!userId) {
        throw new BadRequestException(REQUIRED_USER_ID);
    }
    if (!validateUUID(userId)) {
        throw new BadRequestException(INVALID_USER_ID);
    }
}

/**
 * Validates both contactInfoId and userId, checking that both are present and
 * the contactInfoId format is valid.
 * Throws BadRequestException if any validation fails.
 *
 * @param contactInfoId - The contact information ID to validate
 * @param userId - The user ID to validate
 */
export function validateIds(contactInfoId: string, userId: string): void {
    if (!contactInfoId || !userId) {
        throw new BadRequestException(REQUIRED_USER_ID_AND_CONTACT_INFO_ID);
    }
    if (!validateUUID(contactInfoId)) {
        throw new BadRequestException(INVALID_CONTACT_INFO_ID);
    }
    if (!validateUUID(userId)) {
        throw new BadRequestException(INVALID_USER_ID);
    }
}

/**
 * Validates the provided category ID by ensuring it is both present and in a valid UUID format.
 *
 * @param {string} categoryId - The category ID to be validated.
 *
 * @throws {BadRequestException} If the category ID is not provided.
 * @throws {BadRequestException} If the category ID is not a valid UUID.
 */
 export function validateCategoryId(categoryId: string): void {
    if (!categoryId) {
        throw new BadRequestException(REQUIRED_CATEGORY_ID);
    }
    if (!validateUUID(categoryId)) {
        throw new BadRequestException(INVALID_CATEGORY_ID);
    }
}

/**
 * Validates the provided product ID by ensuring it is both present and in a valid UUID format.
 *
 * @param {string} productId - The product ID to be validated.
 *
 * @throws {BadRequestException} If the product ID is not provided.
 * @throws {BadRequestException} If the product ID is not a valid UUID.
 */
export function validateProductId(productId: string): void {
    if (!productId) {
        throw new BadRequestException(REQUIRED_PRODUCT_ID);
    }
    if (!validateUUID(productId)) {
        throw new BadRequestException(INVALID_PRODUCT_ID);
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
        throw new BadRequestException('Invalid product type');
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
        throw new BadRequestException('Page must be greater than 0');
    }
    if (pageSize < 1) {
        throw new BadRequestException('Page size must be greater than 0');
    }
    if (page > pageSize) {
        throw new BadRequestException('Page cannot be greater than page size');
    }
}

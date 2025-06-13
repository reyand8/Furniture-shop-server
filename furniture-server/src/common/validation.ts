import { BadRequestException, NotFoundException } from '@nestjs/common';

import { ERROR_MESSAGES } from './constants';
import { ProductType } from '../models/product/product.entity';


const {
    REQUIRED_PRODUCT_TYPE,
    NOT_FOUND_DTO,
    INVALID_PRODUCT_TYPE,
} = ERROR_MESSAGES

/**
 * Updates fields of an entity using a DTO, excluding
 * forbidden fields like password, id, and role.
 *
 * @param entity - The entity to update
 * @param updateDto - The DTO containing fields to update
 */
export function updateEntityWithDto<T>(
    entity: T,
    updateDto: Partial<T>,
): T {
    const updatedEntity = { ...entity };
    for (const key in updateDto) {
        if (updateDto[key] !== undefined) {
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
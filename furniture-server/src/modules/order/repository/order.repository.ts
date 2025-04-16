import { InjectRepository } from '@nestjs/typeorm';
import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { In, Repository } from 'typeorm';

import { OrderEntity } from '../../../models/order/order.entity';
import { ContactInfoEntity } from '../../../models/contact-info/contact-info.entity';
import { ProductEntity } from '../../../models/product/product.entity';
import { ERROR_MESSAGES } from '../../common/constants';
import { validateDtoFields } from '../../common/validation';
import { UpdateOrderDto } from '../dto/updateOrder.dto';
import { UpdateOrderStatusDto } from '../dto/updateOrderStatus.dto';


const {
    INVALID_CONTACT_INFO, NOT_FOUND_PRODUCT_IN_ORDER,
    UNAVAILABLE_PRODUCTS, NOT_FOUND_ORDER, NOT_FOUND_CONTACT_INFO } = ERROR_MESSAGES;

@Injectable()
export class OrderRepository {
    constructor(
        @InjectRepository(ContactInfoEntity)
        private readonly contactInfoRepo: Repository<ContactInfoEntity>,
        @InjectRepository(ProductEntity)
        private readonly productRepo: Repository<ProductEntity>,
        @InjectRepository(OrderEntity)
        private readonly orderRepo: Repository<OrderEntity>,
    ) {}

    /**
     * Retrieves a contact information record by its ID and associated user ID.
     * Throws an error if the contact information is not found or doesn't belong to the user.
     *
     * @param contactInfoId - The ID of the contact information to retrieve
     * @param userId - The ID of the user who owns the contact information
     * @returns The found ContactInfoEntity
     */
    async findContactInfoByUser(
        contactInfoId: string,
        userId: string
    ): Promise<ContactInfoEntity> {
        const contactInfo: ContactInfoEntity | null =
            await this.contactInfoRepo.findOne({
            where: { id: contactInfoId, user: { id: userId } },
        });
        if (!contactInfo) {
            throw new BadRequestException(INVALID_CONTACT_INFO);
        }
        return contactInfo;
    }

    /**
     * Retrieves and validates a list of products by their IDs.
     * Ensures all requested products exist and are available.
     * Throws an error if any product is missing or unavailable.
     *
     * @param productIds - Array of product IDs to validate
     * @returns An array of valid and available ProductEntity objects
     */
    async getValidProducts(productIds: string[]): Promise<ProductEntity[]> {
        const products: ProductEntity[] = await this.productRepo.find({
            where: { id: In(productIds)}
        });

        if (products.length !== productIds.length) {
            throw new BadRequestException(NOT_FOUND_PRODUCT_IN_ORDER);
        }

        const unavailableProducts: ProductEntity[] =
            products.filter((product: ProductEntity): boolean => !product.isAvailable);

        if (unavailableProducts.length > 0) {
            const names: string =
                unavailableProducts.map((p: ProductEntity): string => p.name).join(', ');
            throw new BadRequestException(`${UNAVAILABLE_PRODUCTS} ${names}`);
        }
        return products;
    }

    /**
     * Retrieves all orders for a given user, including related entities.
     * Orders are returned in descending order by creation date.
     *
     * @param userId - The ID of the user whose orders are being retrieved
     * @returns An array of OrderEntity objects with related data
     */
    getAllOrders(userId: string): Promise<OrderEntity[]> {
       return this.orderRepo.find({
            where: {
                user: { id: userId },
            },
            relations: ['orderItems', 'contactInfo', 'user'],
            order: { createdAt: 'DESC' }
        });
    }

    /**
     * Retrieves a specific order by its ID for a given user, including related entities.
     * Throws an error if the order is not found or does not belong to the user.
     *
     * @param userId - The ID of the user who owns the order
     * @param id - The ID of the order to retrieve
     * @returns The found OrderEntity with related data
     */
    async getOneOrderByUser(userId: string, id: string): Promise<OrderEntity> {
        const order: OrderEntity | null = await this.orderRepo.findOne({
            where: {
                id,
                user: { id: userId },
            },
            relations: ['orderItems', 'user', 'contactInfo'],
        });
        if (!order) {
            throw new NotFoundException(NOT_FOUND_ORDER);
        }
        return order;
    }

    /**
     * Updates the status of an order based on the provided data transfer object (DTO).
     * Validates the DTO fields before saving the updated order.
     *
     * @param order - The order to update
     * @param updateOrderStatusDto - The DTO containing the updated order status
     * @returns The updated OrderEntity
     */
    updateOrderStatus(
        order: OrderEntity,
        updateOrderStatusDto: UpdateOrderStatusDto
    ): Promise<OrderEntity> {
        const validatedDto: OrderEntity =
            validateDtoFields(order, updateOrderStatusDto);
        return this.saveOrder(validatedDto);
    }

    /**
     * Updates the details of an existing order based on the provided DTO.
     * Validates the DTO fields and updates the contact information if specified.
     * Throws an error if the new contact information is not found.
     *
     * @param order - The order to update
     * @param updateOrderDto - The DTO containing the updated order details
     * @returns The updated OrderEntity
     */
    async updateOrder(
        order: OrderEntity,
        updateOrderDto: UpdateOrderDto
    ): Promise<OrderEntity> {
        if (updateOrderDto.contactInfoId) {
            const newContactInfo: ContactInfoEntity | null =
                await this.contactInfoRepo.findOne({
                    where: { id: updateOrderDto.contactInfoId }
                });
            if (!newContactInfo) {
                throw new NotFoundException(NOT_FOUND_CONTACT_INFO);
            }
            order.contactInfo = newContactInfo;
        }
        const validatedDto: OrderEntity =
            validateDtoFields(order, updateOrderDto);
        return this.saveOrder(validatedDto);
    }

    /**
     * Creates a new order based on the provided order data.
     *
     * @param orderData - The data used to create a new order
     * @returns The created OrderEntity
     */
    createOrder(orderData: Partial<OrderEntity>): OrderEntity {
        return this.orderRepo.create(orderData);
    }

    /**
     * Saves the provided order entity to the database.
     *
     * @param order - The order entity to save
     * @returns The saved OrderEntity
     */
    saveOrder(order: OrderEntity): Promise<OrderEntity> {
        return this.orderRepo.save(order);
    }
}

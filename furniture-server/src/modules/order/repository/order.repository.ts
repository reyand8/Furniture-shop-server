import { InjectRepository } from '@nestjs/typeorm';
import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';

import { OrderEntity } from '../../../models/order/order.entity';
import { validateDtoFields } from '../../common/validation';
import { UpdateOrderStatusDto } from '../dto/updateOrderStatus.dto';


@Injectable()
export class OrderRepository {
    constructor(
        @InjectRepository(OrderEntity)
        private readonly orderRepo: Repository<OrderEntity>,
    ) {}

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
    async getOneOrderByUser(userId: string, id: string): Promise<OrderEntity | null> {
        return await this.orderRepo.findOne({
            where: {
                id,
                user: {id: userId},
            },
            relations: ['orderItems', 'user', 'contactInfo'],
        });
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

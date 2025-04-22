import { InjectRepository } from '@nestjs/typeorm';
import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';

import { OrderEntity } from '../../../models/order/order.entity';


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
     * @param orderId - The ID of the order to retrieve
     * @returns The found OrderEntity with related data
     */
    async getOneOrderByUser(userId: string, orderId: string): Promise<OrderEntity | null> {
        return await this.orderRepo.findOne({
            where: {
                id: orderId,
                user: {id: userId},
            },
            relations: ['orderItems', 'user', 'contactInfo'],
        });
    }

    /**
     * Creates a new order entity from the provided data and saves it to the database.
     *
     * @param order - The order entity to save
     * @returns The saved OrderEntity
     */
    createAndSaveOrder(order: Partial<OrderEntity>): Promise<OrderEntity> {
        const createOrder: OrderEntity = this.orderRepo.create(order);
        return this.orderRepo.save(createOrder);
    }
}

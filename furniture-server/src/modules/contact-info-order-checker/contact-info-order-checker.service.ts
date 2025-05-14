import { Injectable } from '@nestjs/common';

import { OrderRepository } from '../order/repository/order.repository';
import { OrderEntity } from '../../models/order/order.entity';


@Injectable()
export class ContactInfoOrderCheckerService {
    constructor(
        private readonly orderRepository: OrderRepository,
    ) {}

    /**
     * Checks whether the given contact info is associated with an existing order.
     *
     * @param contactInfoId - The ID of the contact info to check.
     * @returns A promise that resolves to `true` if the contact info is
     * used in an order, `false` otherwise.
     */
    async isContactInfoUsed(contactInfoId: string): Promise<boolean> {
        const order: OrderEntity | null =
            await this.orderRepository.getOneOrderByContactInfo(contactInfoId);
        return !!order;
    }
}
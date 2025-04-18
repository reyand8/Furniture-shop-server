import { Injectable } from '@nestjs/common';

import { CreateOrderItemDto } from '../dto/createOrderItem.dto';
import { ProductEntity } from '../../../models/product/product.entity';
import { OrderDetailsEntity } from '../../../models/order-details/order-details.entity';


@Injectable()
export class OrderDetailsFactory {

    /**
     * Creates order detail entities based on the provided order items and products.
     * Calculates the total order amount using either the discount price or regular price.
     *
     * @param orderItems - List of items requested in the order.
     * @param products - List of valid product entities corresponding to the order items.
     * @returns An object containing the generated order details and the total price.
     */
    createDetails(
        orderItems: CreateOrderItemDto[],
        products: ProductEntity[])
        : {
        details: OrderDetailsEntity[],
        total: number
    } {
        const details: OrderDetailsEntity[] = [];
        let totalAmount: number = 0;

        for (const item of orderItems) {
            const { productId, quantity } = item;
            const product: ProductEntity | undefined =
                products.find((p: ProductEntity): boolean => p.id === productId);
            if (!product) continue;

            const finalPrice: number = product.discountPrice ?? product.price;

            const detail = new OrderDetailsEntity();
            detail.product = product;
            detail.quantity = quantity;
            detail.price = finalPrice;

            details.push(detail);
            totalAmount += finalPrice * quantity;
        }
        return { details, total: totalAmount };
    }
}

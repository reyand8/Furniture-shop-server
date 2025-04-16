import {BadRequestException, Injectable, InternalServerErrorException} from '@nestjs/common';


import { ContactInfoEntity } from '../../models/contact-info/contact-info.entity';
import { OrderEntity, OrderStatus } from "../../models/order/order.entity";
import { ProductEntity } from '../../models/product/product.entity';
import { UpdateOrderDto } from './dto/updateOrder.dto';
import { CreateOrderDto } from './dto/createOrder.dto';
import { CreateOrderItemDto } from './dto/createOrderItem.dto';
import { UpdateOrderStatusDto } from './dto/updateOrderStatus.dto';
import { UserEntity } from '../../models/user/user.entity';
import { OrderRepository } from './repository/order.repository';
import { OrderDetailsFactory } from './factory/orderDetails.factory';
import { validateDtoNotEmpty, validateOrderId, validateUser } from '../common/validation';
import { ERROR_MESSAGES } from '../common/constants';


const { ERROR_PERMISSION_ORDER_UPDATE, ERROR_SERVER } = ERROR_MESSAGES;

@Injectable()
export class OrderService {
    constructor(
        private readonly orderRepository: OrderRepository,
        private readonly orderDetailsFactory: OrderDetailsFactory
    ) {}

    /**
     * Creates a new order based on the provided DTO and the authenticated user's data.
     * Validates the input data, checks product availability, calculates order details,
     * and saves the new order.
     *
     * @param createOrderDto - The DTO containing the order details to create
     * @param user - The authenticated user who is creating the order
     * @returns The created OrderEntity
     */
    async create(createOrderDto: CreateOrderDto, user: UserEntity): Promise<OrderEntity> {
        validateDtoNotEmpty(createOrderDto);
        validateUser(user);
        try {
            const {contactInfoId, orderItems, paymentMethod, status, notes} = createOrderDto;
            const contactInfo: ContactInfoEntity =
                await this.orderRepository.findContactInfoByUser(contactInfoId, user.id);
            const productIds: string[] =
                orderItems.map((item: CreateOrderItemDto): string => item.productId);
            const products: ProductEntity[] =
                await this.orderRepository.getValidProducts(productIds);

            const {details: orderDetails, total: totalAmount} =
                this.orderDetailsFactory.createDetails(orderItems, products);

            const order: OrderEntity = this.orderRepository.createOrder({
                user,
                contactInfo,
                orderItems: orderDetails,
                paymentMethod,
                status: status || OrderStatus.PENDING,
                totalAmount,
                notes,
            });
            return this.orderRepository.saveOrder(order);
        } catch (error) {
            throw new InternalServerErrorException(ERROR_SERVER, error.message);
        }
    }

    /**
     * Retrieves all orders for the authenticated user.
     * Validates the user's data and retrieves the orders from the repository.
     *
     * @param user - The authenticated user whose orders are being retrieved
     * @returns An array of OrderEntity objects
     */
    async findAll(user: UserEntity): Promise<OrderEntity[]> {
        validateUser(user);
        try {
            return this.orderRepository.getAllOrders(user.id);
        } catch (error) {
            throw new InternalServerErrorException(ERROR_SERVER, error.message);
        }
    }

    /**
     * Retrieves a specific order by its ID for the authenticated user.
     * Validates the user's data and the order ID before fetching the order.
     *
     * @param user - The authenticated user who owns the order
     * @param orderId - The ID of the order to retrieve
     * @returns The found OrderEntity
     */
    async findOneByUserId(user: UserEntity, orderId: string): Promise<OrderEntity> {
        validateUser(user);
        validateOrderId(orderId);
        try {
            return this.orderRepository.getOneOrderByUser(user.id, orderId);
        } catch (error) {
            throw new InternalServerErrorException(ERROR_SERVER, error.message);
        }
    }

    /**
     * Updates the status of an order by its ID for the authenticated user.
     * Validates the input DTO, order ID, and user data before updating the order status.
     *
     * @param user - The authenticated user who owns the order
     * @param updateOrderStatusDto - The DTO containing the updated order status
     * @param orderId - The ID of the order to update
     * @returns The updated OrderEntity
     */
    async updateOrderStatus(
        user: UserEntity,
        updateOrderStatusDto: UpdateOrderStatusDto,
        orderId: string
    ): Promise<OrderEntity> {
        validateUser(user);
        validateDtoNotEmpty(updateOrderStatusDto);
        validateOrderId(orderId);
        try {
            const order: OrderEntity | null =
                await this.orderRepository.getOneOrderByUser(user.id, orderId);

            return this.orderRepository.updateOrderStatus(order, updateOrderStatusDto);
        } catch (error) {
            throw new InternalServerErrorException(ERROR_SERVER, error.message);
        }
    }

    /**
     * Updates the details of an existing order based on the provided DTO and order ID for the authenticated user.
     * Validates the user's data and ensures the order is eligible for updates based on its creation time.
     *
     * @param user - The authenticated user who owns the order
     * @param updateOrderDto - The DTO containing the updated order details
     * @param orderId - The ID of the order to update
     * @returns The updated OrderEntity
     */
    async updateOrder(
        user: UserEntity,
        updateOrderDto: UpdateOrderDto,
        orderId: string
    ): Promise<OrderEntity> {
        validateUser(user);
        validateDtoNotEmpty(updateOrderDto);
        validateOrderId(orderId);
        try {
            const order: OrderEntity | null =
                await this.orderRepository.getOneOrderByUser(user.id, orderId);

            const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);

            if (order.createdAt < fiveMinutesAgo) {
                throw new BadRequestException(ERROR_PERMISSION_ORDER_UPDATE);
            }
            return this.orderRepository.updateOrder(order, updateOrderDto);
        } catch (error) {
            throw new InternalServerErrorException(ERROR_SERVER, error.message);
        }
    }
}
import {
    BadRequestException,
    Injectable,
    NotFoundException
} from '@nestjs/common';

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
import {
    validateDtoFields,
    validateDtoNotEmpty,
} from '../../common/validation';
import { ERROR_MESSAGES } from '../../common/constants';
import { UserService } from '../user/user.service';
import { ProductRepository } from '../product/repository/product.repository';


const {
    ERROR_PERMISSION_ORDER_UPDATE,
    NOT_FOUND_PRODUCT_IN_ORDER,
    UNAVAILABLE_PRODUCTS,
    NOT_FOUND_ORDER
} = ERROR_MESSAGES;

@Injectable()
export class OrderService {
    constructor(
        private readonly orderRepository: OrderRepository,
        private readonly orderDetailsFactory: OrderDetailsFactory,
        private readonly productRepository: ProductRepository,
        private readonly userService: UserService,
    ) {}

    /**
     * Creates a new order using the provided order data and the authenticated user's information.
     * This method performs the following steps:
     * - Validates the input DTO.
     * - Retrieves the user's contact information.
     * - Ensures all products exist and are available.
     * - Calculates the order details and total amount.
     * - Creates and persists the new order.
     *
     * @param createOrderDto - The data transfer object containing order information.
     * @param user - The authenticated user placing the order.
     * @returns A promise that resolves to the created OrderEntity.
     */
    async create(createOrderDto: CreateOrderDto, user: UserEntity): Promise<OrderEntity> {
        validateDtoNotEmpty(createOrderDto);

        const {contactInfoId, orderItems, paymentMethod, status, notes} = createOrderDto;

        const contactInfo: ContactInfoEntity =
            await this.userService.getContactInfoByIdAndUser(contactInfoId, user.id);

        const selectedProducts: ProductEntity[] = await this.checkProductsExist(orderItems);

        this.checkUnavailableProducts(selectedProducts);

        const {details: orderDetails, total: totalAmount} =
            this.orderDetailsFactory.createDetails(orderItems, selectedProducts);

        return this.orderRepository.createAndSaveOrder({
            user, contactInfo,
            orderItems: orderDetails,
            paymentMethod,
            status: status || OrderStatus.PENDING,
            totalAmount,
            notes,
        });
    }

    /**
     * Retrieves all orders associated with the authenticated user.
     * This method fetches all orders linked to the user's ID from the repository.
     *
     * @param user - The authenticated user whose orders are being retrieved.
     * @returns A promise that resolves to an array of OrderEntity objects.
     */
    async findAll(user: UserEntity): Promise<OrderEntity[]> {
        return this.orderRepository.getAllOrders(user.id);
    }

    /**
     * Retrieves a single order by its ID for the specified user.
     * Validates the order ID and ensures the order belongs to the given user.
     *
     * @param userId - The ID of the authenticated user who owns the order.
     * @param orderId - The ID of the order to retrieve.
     * @returns A promise that resolves to the found OrderEntity.
     * @throws NotFoundException if the order is not found.
     */
    async findOneOrderByUserId(userId: string, orderId: string): Promise<OrderEntity> {
        const order: OrderEntity | null =
            await this.orderRepository.getOneOrderByUser(userId, orderId);
        if (!order) {
            throw new NotFoundException(NOT_FOUND_ORDER);
        }
        if (order.user) {
            delete (order.user as Partial<UserEntity>).password;
        }
        return order;
    }

    /**
     * Updates the status of a specific order for the authenticated user.
     * Validates the provided DTO, order ID, and ensures the order belongs to the user.
     *
     * @param updateOrderStatusDto - The DTO containing the new order status.
     * @param orderId - The ID of the order to be updated.
     * @returns A promise that resolves to the updated OrderEntity.
     * @throws NotFoundException if the order is not found.
     */
    async updateOrderStatus(
        orderId: string,
        updateOrderStatusDto: UpdateOrderStatusDto,
    ): Promise<OrderEntity> {
        const order: OrderEntity | null =
            await this.orderRepository.getOneOrderByOrderId(orderId);
        if (!order) {
            throw new NotFoundException(NOT_FOUND_ORDER);
        }
        const validatedDto: OrderEntity =
            validateDtoFields(order, updateOrderStatusDto);

        const updatedOrderStatus: OrderEntity =
            await this.orderRepository.createAndSaveOrder(validatedDto);
        if (updatedOrderStatus.user) {
            delete (updatedOrderStatus.user as Partial<UserEntity>).password;
        }
        return updatedOrderStatus;
    }

    /**
     * Updates the details of an existing order based on the provided DTO and order ID for the authenticated user.
     * Validates the user's data and ensures the order is eligible for updates based on its creation time.
     * If a new contactInfoId is provided, it fetches and assigns the updated contact information.
     *
     * @param user - The authenticated user who owns the order.
     * @param updateOrderDto - The DTO containing the updated order fields.
     * @param orderId - The ID of the order to be updated.
     * @returns A promise that resolves to the updated OrderEntity.
     * @throws NotFoundException if the order is not found.
     */
    async updateOrder( user: UserEntity, updateOrderDto: UpdateOrderDto, orderId: string
    ): Promise<OrderEntity> {
        validateDtoNotEmpty(updateOrderDto);
        const { contactInfoId } = updateOrderDto
        const order: OrderEntity = await this.findOneOrderByUserId(user.id, orderId);
        this.checkCreatedTime(order.createdAt);

        if (contactInfoId) {
            const newContactInfo: ContactInfoEntity[] =
                await this.userService.getContactInfo(contactInfoId)
            order.contactInfo = newContactInfo[0];
        }
        const validatedDto: OrderEntity = validateDtoFields(order, updateOrderDto);
        return this.orderRepository.createAndSaveOrder(validatedDto);
    }

    /**
     * Checks whether all products referenced in the order items exist.
     * Throws a BadRequestException if any product is missing.
     *
     * @param orderItems - The list of order items containing product IDs.
     * @returns A promise that resolves to the list of found ProductEntity instances.
     * @throws BadRequestException if one or more products are not found.
     */
    async checkProductsExist(orderItems: CreateOrderItemDto[]): Promise<ProductEntity[]> {
        const productIds: string[] =
            orderItems.map((item: CreateOrderItemDto): string => item.productId);

        const selectedProducts: ProductEntity[] =
            await this.productRepository.findProductsByIds(productIds);

        const foundIds: Set<string> = new Set(
            selectedProducts.map((product: ProductEntity): string => product.id)
        );

        const missingIds: string[] = productIds.filter(
            (id: string): boolean => !foundIds.has(id)
        );

        if (missingIds.length > 0) {
            const ids: string = missingIds.join(', ');
            throw new BadRequestException(`${NOT_FOUND_PRODUCT_IN_ORDER} [${ids}]`);
        }
        return selectedProducts
    }

    /**
     * Verifies that all provided products are available.
     * Throws a BadRequestException listing the unavailable products if any are found.
     *
     * @param products - The list of ProductEntity instances to check.
     * @throws BadRequestException if any product is unavailable.
     */
    checkUnavailableProducts(products: ProductEntity[]): void {
        const unavailableProducts: ProductEntity[] =
            products.filter((product: ProductEntity): boolean => !product.isAvailable);

        if (unavailableProducts.length > 0) {
            const names: string =
                unavailableProducts.map((p: ProductEntity): string => p.id).join(', ');
            throw new BadRequestException(`${UNAVAILABLE_PRODUCTS} [${names}]`);
        }
    }

    /**
     * Ensures the order was created within the last 5 minutes.
     * Used to restrict updates after a short time window.
     *
     * @param createdTime - The creation timestamp of the order.
     * @throws BadRequestException if the order is older than 5 minutes.
     */
    checkCreatedTime(createdTime: Date): void {
        const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);
        if (createdTime < fiveMinutesAgo) {
            throw new BadRequestException(ERROR_PERMISSION_ORDER_UPDATE);
        }
    }
}
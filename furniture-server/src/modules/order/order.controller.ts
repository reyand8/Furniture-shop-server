import {
    Controller, Get, Post, Param,
    Body, UseGuards, Request, Put,
    UseInterceptors, ParseUUIDPipe
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

import { OrderService } from './order.service';
import { OrderEntity } from '../../models/order/order.entity';
import { CreateOrderDto } from './dto/createOrder.dto';
import { UpdateOrderDto } from './dto/updateOrder.dto';
import { UpdateOrderStatusDto } from './dto/updateOrderStatus.dto';
import { Roles } from '../auth/roles-guard/roles.decorator';
import { EUserRole } from '../../models/user/user.entity';
import { RolesGuard } from '../auth/roles-guard/roles.guard';
import { ErrorInterceptor } from '../../common/errorInterceptor';
import { IOrdersGroupedByStatus } from './interfaces/order.interface';


@UseInterceptors(ErrorInterceptor)
@Controller('orders')
export class OrderController {
    constructor(private readonly orderService: OrderService) {}

    /**
     * Creates a new order using the provided DTO and authenticated user's data.
     * Requires JWT authentication.
     *
     * @param createOrderDto - The data to create the new order
     * @param req - The request object, containing authenticated user info
     * @returns The created OrderEntity
     */
    @Post()
    @UseGuards(AuthGuard('jwt'))
    async create(
        @Body() createOrderDto: CreateOrderDto,
        @Request() req: any
    ): Promise<OrderEntity> {
        return this.orderService.create(createOrderDto, req.user);
    }

    /**
     * Retrieves all orders for the authenticated user.
     * Requires JWT authentication.
     *
     * @param req - The request object, containing authenticated user info
     * @returns An array of OrderEntity objects
     */
    @Get()
    @UseGuards(AuthGuard('jwt'))
    async findAll(@Request() req: any): Promise<OrderEntity[]> {
        return this.orderService.findAll(req.user);
    }

    /**
     * Retrieves all orders grouped by user for admin users.
     * Requires JWT authentication and admin roles (SUPER_ADMIN, ADMIN).
     *
     * @returns A promise that resolves to an array of grouped orders by user.
     */
    @Get('admin')
    @Roles(EUserRole.SUPER_ADMIN, EUserRole.ADMIN)
    @UseGuards(AuthGuard('jwt'))
    async findAllByAdmin(): Promise<IOrdersGroupedByStatus> {
        return this.orderService.findAllByAdmin();
    }

    /**
     * Retrieves a specific order by its ID for the authenticated user.
     * Requires JWT authentication.
     *
     * @param orderId - The ID of the order to retrieve
     * @param req - The request object, containing authenticated user info
     * @returns The found OrderEntity
     */
    @Get(':uuid')
    @UseGuards(AuthGuard('jwt'))
    async findOne(
        @Param('uuid', new ParseUUIDPipe()) orderId: string,
        @Request() req: any
    ): Promise<OrderEntity> {
        return this.orderService.findOneOrderByUserId(req.user.id, orderId);
    }

    /**
     * Updates the status of an existing order by its ID for the authenticated user.
     * Requires JWT authentication.
     *
     * @param orderId - The ID of the order to update
     * @param updateOrderStatusDto - The DTO containing the updated order status
     * @returns The updated OrderEntity
     */
    @Post('update-status/:uuid')
    @Roles(EUserRole.SUPER_ADMIN, EUserRole.ADMIN)
    @UseGuards(AuthGuard('jwt'), RolesGuard)
    async updateOrderStatus(
        @Param('uuid', new ParseUUIDPipe()) orderId: string,
        @Body() updateOrderStatusDto: UpdateOrderStatusDto,
    ): Promise<OrderEntity> {
        return this.orderService.updateOrderStatus(orderId, updateOrderStatusDto);
    }

    /**
     * Updates an existing order by its ID for the authenticated user.
     * Requires JWT authentication.
     *
     * @param orderId - The ID of the order to update
     * @param updateOrderDto - The DTO containing the updated order details
     * @param req - The request object, containing authenticated user info
     * @returns The updated OrderEntity
     */
    @Put('update/:uuid')
    @UseGuards(AuthGuard('jwt'))
    async updateOrder(
        @Param('uuid', new ParseUUIDPipe()) orderId: string,
        @Body() updateOrderDto: UpdateOrderDto,
        @Request() req: any
    ): Promise<OrderEntity> {
        return this.orderService.updateOrder(req.user.id, updateOrderDto, orderId);
    }
}

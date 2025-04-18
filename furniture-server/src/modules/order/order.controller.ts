import {
    Controller, Get, Post, Param,
    Body, UseGuards, Request, Put
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

import { OrderService } from './order.service';
import { OrderEntity } from '../../models/order/order.entity';
import { CreateOrderDto } from './dto/createOrder.dto';
import { UpdateOrderDto } from './dto/updateOrder.dto';
import { UpdateOrderStatusDto } from './dto/updateOrderStatus.dto';


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
    create(
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
    findAll(@Request() req: any): Promise<OrderEntity[]> {
        return this.orderService.findAll(req.user);
    }

    /**
     * Retrieves a specific order by its ID for the authenticated user.
     * Requires JWT authentication.
     *
     * @param id - The ID of the order to retrieve
     * @param req - The request object, containing authenticated user info
     * @returns The found OrderEntity
     */
    @Get(':id')
    @UseGuards(AuthGuard('jwt'))
    findOne(
        @Param('id') id: string,
        @Request() req: any
    ): Promise<OrderEntity> {
        return this.orderService.findOneOrderByUserId(req.user.id, id);
    }

    /**
     * Updates the status of an existing order by its ID for the authenticated user.
     * Requires JWT authentication.
     *
     * @param id - The ID of the order to update
     * @param updateOrderStatusDto - The DTO containing the updated order status
     * @param req - The request object, containing authenticated user info
     * @returns The updated OrderEntity
     */
    @Post('update-status/:id')
    @UseGuards(AuthGuard('jwt'))
    updateOrderStatus(
        @Param('id') id: string,
        @Body() updateOrderStatusDto: UpdateOrderStatusDto,
        @Request() req: any
    ): Promise<OrderEntity> {
        return this.orderService.updateOrderStatus(req.user.id, updateOrderStatusDto, id);
    }

    /**
     * Updates an existing order by its ID for the authenticated user.
     * Requires JWT authentication.
     *
     * @param id - The ID of the order to update
     * @param updateOrderDto - The DTO containing the updated order details
     * @param req - The request object, containing authenticated user info
     * @returns The updated OrderEntity
     */
    @Put('update/:id')
    @UseGuards(AuthGuard('jwt'))
    updateOrder(
        @Param('id') id: string,
        @Body() updateOrderDto: UpdateOrderDto,
        @Request() req: any
    ): Promise<OrderEntity> {
        return this.orderService.updateOrder(req.user.id, updateOrderDto, id);
    }
}

import { IsEnum, IsNotEmpty } from 'class-validator';

import { OrderStatus } from '../../../models/order/order.entity';


export class UpdateOrderStatusDto {
    @IsEnum(OrderStatus)
    @IsNotEmpty({ message: 'Status is required'})
    status: OrderStatus;
}
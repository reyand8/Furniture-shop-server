import { IsEnum } from 'class-validator';

import { OrderStatus } from '../../../models/order/order.entity';


export class UpdateOrderStatusDto {
    @IsEnum(OrderStatus)
    status: OrderStatus;
}
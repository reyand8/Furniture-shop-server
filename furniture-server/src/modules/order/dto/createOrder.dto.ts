import {
    IsEnum, IsOptional,
    IsString, ValidateNested
} from 'class-validator';
import { Type } from 'class-transformer';

import { OrderStatus, PaymentMethod } from '../../../models/order/order.entity';
import { CreateOrderItemDto } from './createOrderItem.dto';


export class CreateOrderDto {
    @IsString()
    contactInfoId: string;

    @ValidateNested({ each: true })
    @Type((): typeof CreateOrderItemDto => CreateOrderItemDto)
    orderItems: CreateOrderItemDto[];

    @IsEnum(OrderStatus)
    @IsOptional()
    status: OrderStatus;

    @IsEnum(PaymentMethod)
    paymentMethod: PaymentMethod;

    @IsString()
    @IsOptional()
    notes: string;
}
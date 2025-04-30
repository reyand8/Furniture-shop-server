import {
    IsEnum, IsOptional,
    IsString, IsUUID, ValidateNested
} from 'class-validator';
import { Type } from 'class-transformer';

import { OrderStatus, PaymentMethod } from '../../../models/order/order.entity';
import { CreateOrderItemDto } from './createOrderItem.dto';


export class CreateOrderDto {
    @IsUUID('4', { message: 'Contact info ID must be a valid UUID.' })
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
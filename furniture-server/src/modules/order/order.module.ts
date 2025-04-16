import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PassportModule } from '@nestjs/passport';

import { OrderController } from './order.controller';
import { OrderService } from './order.service';
import { OrderDetailsEntity } from '../../models/order-details/order-details.entity';
import { ContactInfoEntity } from '../../models/contact-info/contact-info.entity';
import { ProductEntity } from '../../models/product/product.entity';
import { OrderEntity } from '../../models/order/order.entity';
import { UserEntity } from '../../models/user/user.entity';
import { OrderRepository } from './repository/order.repository';
import { OrderDetailsFactory } from './factory/orderDetails.factory';


@Module({
    imports: [
        TypeOrmModule.forFeature([
            OrderEntity,
            OrderDetailsEntity,
            UserEntity,
            ContactInfoEntity,
            ProductEntity
        ]),
        PassportModule.register({ defaultStrategy: 'jwt' }),
    ],
    controllers: [OrderController],
    providers: [
        OrderService,
        OrderRepository,
        OrderDetailsFactory,
    ],
})

export class OrderModule {}
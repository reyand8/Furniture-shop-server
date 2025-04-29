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
import { ProductRepository } from '../product/repository/product.repository';
import { UserService } from '../user/user.service';
import { UserRepository } from '../user/repository/user.repository';
import { ContactInfoRepository } from '../user/repository/contactInfo.repository';
import { ProductService } from '../product/product.service';
import { CategoryRepository } from '../product/repository/category.repository';
import { CategoryEntity } from '../../models/category/category.entity';


@Module({
    imports: [
        TypeOrmModule.forFeature([
            OrderEntity,
            OrderDetailsEntity,
            UserEntity,
            ContactInfoEntity,
            ProductEntity,
            CategoryEntity,
        ]),
        PassportModule.register({ defaultStrategy: 'jwt' }),
    ],
    controllers: [OrderController],
    providers: [
        OrderService,
        UserService,
        ProductService,
        UserRepository,
        ContactInfoRepository,
        OrderRepository,
        CategoryRepository,
        ProductRepository,
        OrderDetailsFactory,
    ],
})

export class OrderModule {}
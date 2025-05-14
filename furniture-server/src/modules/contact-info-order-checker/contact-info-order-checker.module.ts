import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';

import { ContactInfoOrderCheckerService } from './contact-info-order-checker.service';
import { OrderRepository } from '../order/repository/order.repository';
import { OrderEntity } from '../../models/order/order.entity';

@Module({
    imports: [TypeOrmModule.forFeature([OrderEntity])],
    providers: [ContactInfoOrderCheckerService, OrderRepository],
    exports: [ContactInfoOrderCheckerService],
})
export class OrderInfrastructureModule {}
import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';

import { AbstractEntity } from '../abstract.entity';
import { Product } from '../product/product.entity';
import { OrderEntity } from '../order/order.entity';


@Entity('order_details')
export class OrderDetailsEntity extends AbstractEntity{
  @ManyToOne((): typeof Product => Product, { nullable: false })
  @JoinColumn({ name: 'product_id' })
  product: Product;

  @Column({ type: 'int', nullable: false })
  quantity: number;

  @Column({ type: 'float', nullable: false })
  price: number;

  @ManyToOne((): typeof OrderEntity => OrderEntity, (order: OrderEntity): OrderDetailsEntity[] =>
      order.orderItems, { nullable: false })
  @JoinColumn({ name: 'order_id' })
  order: OrderEntity;
}
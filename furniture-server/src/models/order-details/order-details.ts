import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';

import { AbstractEntity } from '../abstract.entity';
import { Product } from '../product/product.entity';
import { Order } from '../order/order.enity';


@Entity('order_details')
export class OrderDetails extends AbstractEntity{
  @ManyToOne((): typeof Product => Product, { nullable: false })
  @JoinColumn({ name: 'product_id' })
  product: Product;

  @Column({ type: 'int', nullable: false })
  quantity: number;

  @Column({ type: 'float', nullable: false })
  price: number;

  @ManyToOne((): typeof Order => Order, (order: Order): OrderDetails[] =>
      order.orderItems, { nullable: false })
  @JoinColumn({ name: 'order_id' })
  order: Order;
}
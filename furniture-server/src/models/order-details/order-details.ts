import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';

import { AbstractEntity } from '../abstract.entity';
import { Product } from '../product/product.entity';


@Entity('order_details')
export class OrderDetails extends AbstractEntity{
  @ManyToOne((): typeof Product => Product, { nullable: false })
  @JoinColumn({ name: 'product_id' })
  product: Product;

  @Column({ type: 'int', nullable: false })
  quantity: number;

  @Column({ type: 'float', nullable: false })
  price: number;
}
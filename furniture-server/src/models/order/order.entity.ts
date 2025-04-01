import {
  Entity, Column, ManyToOne,
  OneToOne, OneToMany, JoinColumn
} from 'typeorm';

import { UserEntity } from '../user/user.entity';
import { ContactInfo } from '../contact-info/contact-info.entity';
import { OrderDetailsEntity } from '../order-details/order-details.entity';
import { AbstractEntity } from '../abstract.entity';


export enum OrderStatus {
  PENDING = 'PENDING',
  PROCESSING = 'PROCESSING',
  SHIPPED = 'SHIPPED',
  DELIVERED = 'DELIVERED',
  CANCELED = 'CANCELED'
}

export enum PaymentMethod {
  CREDIT_CARD = 'CREDIT_CARD',
  PAYPAL = 'PAYPAL',
  CASH_ON_DELIVERY = 'CASH_ON_DELIVERY'
}

@Entity('orders')
export class OrderEntity extends AbstractEntity {

  @ManyToOne((): typeof UserEntity => UserEntity, (user: UserEntity): OrderEntity[] =>
      user.orders, { nullable: false })
  @JoinColumn({ name: 'user_id' })
  user: UserEntity;

  @OneToOne((): typeof ContactInfo => ContactInfo, { nullable: false })
  @JoinColumn({ name: 'contact_info_id' })
  contactInfo: ContactInfo;

  @OneToMany((): typeof OrderDetailsEntity => OrderDetailsEntity, (orderItem: OrderDetailsEntity): OrderEntity =>
      orderItem.order, { cascade: true })
  orderItems: OrderDetailsEntity[];

  @Column({ type: 'enum', enum: OrderStatus, default: OrderStatus.PENDING })
  status: OrderStatus;

  @Column({ type: 'enum', enum: PaymentMethod, default: PaymentMethod.CREDIT_CARD })
  paymentMethod: PaymentMethod;

  @Column({ type: 'float', nullable: false })
  totalAmount: number;

  @Column({ type: 'text', nullable: true })
  notes?: string;
}

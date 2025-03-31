import {
  Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToOne, OneToMany,
  JoinColumn, CreateDateColumn, UpdateDateColumn
} from 'typeorm';

import { UserEntity } from '../user/user.entity';
import { ContactInfo } from '../contact-info/contact-info.entity';
import { OrderDetails } from '../order-details/order-details';


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
export class Order {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne((): typeof UserEntity => UserEntity, (user: UserEntity): Order[] =>
      user.orders, { nullable: false })
  @JoinColumn({ name: 'user_id' })
  user: UserEntity;

  @OneToOne((): typeof ContactInfo => ContactInfo, { nullable: false })
  @JoinColumn({ name: 'contact_info_id' })
  contactInfo: ContactInfo;

  @OneToMany((): typeof OrderDetails => OrderDetails, (orderItem: OrderDetails): Order =>
      orderItem.order, { cascade: true })
  orderItems: OrderDetails[];

  @Column({ type: 'enum', enum: OrderStatus, default: OrderStatus.PENDING })
  status: OrderStatus;

  @Column({ type: 'enum', enum: PaymentMethod, default: PaymentMethod.CREDIT_CARD })
  paymentMethod: PaymentMethod;

  @Column({ type: 'float', nullable: false })
  totalAmount: number;

  @Column({ type: 'text', nullable: true })
  notes?: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}

import { Entity, Column, OneToMany } from 'typeorm';

import { AbstractEntity } from '../abstract.entity';
import { ContactInfo } from '../contact-info/contact-info.entity';
import { Order } from '../order/order.enity';


export enum EUserRole {
  ADMIN = 'ADMIN',
  USER = 'USER',
}

@Entity('users')
export class UserEntity extends AbstractEntity {
  @Column({ length: 60, nullable: false })
  firstName: string;

  @Column({ length: 60, nullable: false })
  lastName: string;

  @Column({ unique: true, length: 60, nullable: false })
  email: string;

  @Column({ nullable: false })
  password: string;

  @Column({ type: 'enum', enum: EUserRole, default: EUserRole.USER })
  role: EUserRole;

  @OneToMany((): typeof ContactInfo =>
      ContactInfo, (contactInfo: ContactInfo): UserEntity => contactInfo.user)
  contactInfo: ContactInfo[];

  @OneToMany((): typeof Order => Order, (order: Order): UserEntity => order.user)
  orders: Order[];
}
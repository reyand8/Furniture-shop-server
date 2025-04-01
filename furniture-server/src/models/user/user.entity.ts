import { Entity, Column, OneToMany } from 'typeorm';

import { AbstractEntity } from '../abstract.entity';
import { ContactInfo } from '../contact-info/contact-info.entity';
import { OrderEntity } from '../order/order.entity';


export enum EUserRole {
  SUPER_ADMIN = 'SUPER_ADMIN',
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

  @OneToMany((): typeof OrderEntity => OrderEntity, (order: OrderEntity): UserEntity => order.user)
  orders: OrderEntity[];
}
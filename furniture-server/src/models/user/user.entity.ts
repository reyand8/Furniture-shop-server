import { Entity, Column, OneToMany } from 'typeorm';

import { AbstractEntity } from '../abstract.entity';
import { ContactInfoEntity } from '../contact-info/contact-info.entity';
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

  @Column({ nullable: false, default: true})
  isActive: boolean;

  @Column({ type: 'enum', enum: EUserRole, default: EUserRole.USER })
  role: EUserRole;

  @OneToMany((): typeof ContactInfoEntity =>
      ContactInfoEntity, (contactInfo: ContactInfoEntity): UserEntity => contactInfo.user)
  contactInfo: ContactInfoEntity[];

  @OneToMany((): typeof OrderEntity => OrderEntity, (order: OrderEntity): UserEntity => order.user)
  orders: OrderEntity[];
}
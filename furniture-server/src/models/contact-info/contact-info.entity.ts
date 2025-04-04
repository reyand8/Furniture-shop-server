import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';

import { AbstractEntity } from '../abstract.entity';
import { UserEntity } from '../user/user.entity';


@Entity('contact_info')
export class ContactInfo extends AbstractEntity {
  @Column({ type:'varchar', length: 13, nullable: false })
  phone: string;

  @Column({ type:'varchar', length: 200, nullable: false })
  address: string;

  @Column({ type:'varchar', length: 30, nullable: false })
  zipCode: string;

  @Column({ type:'varchar', length: 100, nullable: false })
  city: string;

  @Column({ type:'varchar', length: 100, nullable: false })
  region: string;

  @Column({ type:'varchar', nullable: false })
  country: string;

  @Column({ type:'varchar', length: 100, nullable: true })
  companyName?: string;

  @Column({ type:'varchar', length: 40, nullable: true })
  companyTaxId?: string;

  @ManyToOne((): typeof UserEntity =>
    UserEntity, (item: UserEntity): ContactInfo[] => item.contactInfo)
  @JoinColumn({ name: 'userId' })
  user: UserEntity;
}

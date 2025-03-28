import { Entity, Column } from 'typeorm';

import { AbstractEntity } from '../abstract.entity';


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
}

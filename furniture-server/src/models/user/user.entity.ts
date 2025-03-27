import {
  Entity, PrimaryGeneratedColumn,
  Column, CreateDateColumn, UpdateDateColumn, BaseEntity } from 'typeorm';


export enum EUserRole {
  ADMIN = 'ADMIN',
  USER = 'USER',
}

@Entity('users')
export class UserEntity extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

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

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

}

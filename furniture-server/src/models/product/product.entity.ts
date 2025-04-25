import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';

import { AbstractEntity } from '../abstract.entity';
import { CategoryEntity } from '../category/category.entity';


export enum ProductType {
  FURNITURE = 'FURNITURE',
  DECOR = 'DECOR',
  ACCESSORIES = 'ACCESSORIES',
}

@Entity('products')
export class ProductEntity extends AbstractEntity{
  @Column({ type: 'varchar', length: 100 })
  name: string;

  @Column({ type: 'varchar', length: 500 })
  description: string;

  @Column({ type: 'float' })
  price: number;

  @Column({ type: 'float', nullable: true })
  discountPrice?: number;

  @Column({ type: 'varchar', length: 20 })
  currency: string;

  @Column('text', { array: true })
  images: string[];

  @Column({ type: 'enum', enum: ProductType })
  type: ProductType;

  @Column({ type: 'varchar', length: 50 })
  size: string;

  @Column({ type: 'varchar', length: 50, nullable: true })
  color?: string;

  @Column({ default: false })
  isBestSeller: boolean;

  @Column({ default: true })
  isAvailable?: boolean;

  @Column({ default: true })
  isActive: boolean;

  @ManyToOne((): typeof CategoryEntity=> CategoryEntity, (category: CategoryEntity): ProductEntity[] =>
      category.products, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'categoryId' })
  category: CategoryEntity;
}
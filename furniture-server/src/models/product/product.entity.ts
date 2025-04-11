import {Entity, Column, ManyToOne} from 'typeorm';

import { AbstractEntity } from '../abstract.entity';
import { CategoryEntity } from '../category/category.entity';


export enum ProductType {
  FURNITURE = 'FURNITURE',
  DECOR = 'DECOR',
  ACCESSORIES = 'ACCESSORIES',
}

@Entity('products')
export class Product extends AbstractEntity{
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

  @Column('text', { array: true })
  sizes: string[];

  @Column({ type: 'varchar', length: 50, nullable: true })
  color?: string;

  @Column({ default: false })
  isBestSeller: boolean;

  @Column()
  categoryId: string;

  @ManyToOne((): typeof CategoryEntity=> CategoryEntity, (category: CategoryEntity): Product[] =>
      category.products, { onDelete: 'CASCADE' })
  category: CategoryEntity;
}
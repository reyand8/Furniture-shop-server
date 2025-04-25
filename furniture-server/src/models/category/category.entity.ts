import { Entity, Column, OneToMany } from 'typeorm';

import { ProductEntity } from '../product/product.entity';
import { AbstractEntity } from '../abstract.entity';


@Entity('categories')
export class CategoryEntity extends AbstractEntity {
  @Column({ unique: true })
  name: string;

  @Column({ default: true })
  isActive: boolean;

  @OneToMany((): typeof ProductEntity => ProductEntity, (product: ProductEntity): CategoryEntity => product.category)
  products: ProductEntity[];
}
import { Entity, Column, OneToMany } from 'typeorm';

import { Product } from '../product/product.entity';
import { AbstractEntity } from '../abstract.entity';


@Entity('categories')
export class CategoryEntity extends AbstractEntity {
  @Column({ unique: true })
  name: string;

  @OneToMany((): typeof Product => Product, (product: Product): CategoryEntity => product.category)
  products: Product[];
}
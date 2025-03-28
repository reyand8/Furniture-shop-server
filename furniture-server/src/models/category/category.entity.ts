import { Entity, Column, OneToMany } from 'typeorm';

import { Product } from '../product/product.entity';
import { AbstractEntity } from '../abstract.entity';


@Entity('categories')
export class Category extends AbstractEntity {
  @Column({ unique: true })
  name: string;

  @OneToMany((): typeof Product => Product, (product: Product): Category => product.category)
  products: Product[];
}
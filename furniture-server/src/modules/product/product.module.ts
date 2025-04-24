import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PassportModule } from '@nestjs/passport';

import { ProductController } from './product.controller';
import { ProductService } from './product.service';
import { CategoryEntity } from '../../models/category/category.entity';
import { ProductEntity } from '../../models/product/product.entity';
import { CategoryRepository } from './repository/category.repository';
import { ProductRepository } from './repository/product.repository';


@Module({
    imports: [
        TypeOrmModule.forFeature([CategoryEntity, ProductEntity]),
        PassportModule.register({ defaultStrategy: 'jwt' }),
    ],
    controllers: [ProductController],
    providers: [
        ProductService,
        CategoryRepository,
        ProductRepository,
    ],
})

export class ProductModule {}
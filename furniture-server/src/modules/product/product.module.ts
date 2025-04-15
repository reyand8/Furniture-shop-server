import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ProductController } from './product.controller';
import { ProductService } from './product.service';
import { CategoryEntity } from '../../models/category/category.entity';


@Module({
    imports: [
        TypeOrmModule.forFeature([CategoryEntity]),
    ],
    controllers: [ProductController],
    providers: [ProductService],
})

export class ProductModule {}
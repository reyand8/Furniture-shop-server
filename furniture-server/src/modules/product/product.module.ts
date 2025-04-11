import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ProductController } from './product.controller';
import { ProductService } from './product.service';
import { AuthModule } from '../auth/auth.module';
import { CategoryEntity } from '../../models/category/category.entity';


@Module({
    imports: [
        TypeOrmModule.forFeature([CategoryEntity]),
        AuthModule
    ],
    controllers: [ProductController],
    providers: [ProductService],
})

export class ProductModule {}
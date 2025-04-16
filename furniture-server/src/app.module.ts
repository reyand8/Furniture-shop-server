import { ConfigModule } from '@nestjs/config';
import { Module } from '@nestjs/common';


import { DatabaseModule } from './modules/db/database.module';
import { AuthModule } from './modules/auth/auth.module';
import { UserModule } from './modules/user/user.module';
import { ProductModule } from './modules/product/product.module';
import { OrderModule } from './modules/order/order.module';


@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    DatabaseModule,
    AuthModule,
    UserModule,
    ProductModule,
    OrderModule
  ],
  controllers: [],
  providers: [],
})

export class AppModule {}
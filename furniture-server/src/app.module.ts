import { ConfigModule } from '@nestjs/config';
import { Module } from '@nestjs/common';


import { DatabaseModule } from './modules/db/database.module';
import { AuthModule } from './modules/auth/auth.module';
import { UserModule } from './modules/user/user.module';


@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    DatabaseModule,
    AuthModule,
    UserModule,
  ],
  controllers: [],
  providers: [],
})

export class AppModule {}
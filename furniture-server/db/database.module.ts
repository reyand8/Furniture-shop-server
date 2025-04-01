import { ConfigService, ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';

import { DatabaseService } from './database.service';


@Module({
    imports: [
        TypeOrmModule.forRootAsync({
            imports: [ConfigModule],
            useClass: DatabaseService,
            inject: [DatabaseService, ConfigService],
        }),
    ],
})

export class DatabaseModule {}
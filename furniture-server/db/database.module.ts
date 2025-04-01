import { ConfigService, ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { DataSourceOptions } from 'typeorm';

import { databaseConfig } from './database.config';


@Module({
    imports: [
        TypeOrmModule.forRootAsync({
            imports: [ConfigModule],
            inject: [ConfigService],
            useFactory: (configService: ConfigService): DataSourceOptions =>
                databaseConfig(configService),
        }),
    ],
})

export class DatabaseModule {}
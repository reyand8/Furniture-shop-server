import { DataSource, DataSourceOptions } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import * as dotenv from 'dotenv';


dotenv.config();
const configService = new ConfigService();

export const dataSourceOptions: DataSourceOptions = {
    type: 'postgres',
    host: configService.get<string>('POSTGRES_DB_HOST'),
    port: Number(configService.get<string>('POSTGRES_DB_PORT')),
    username: configService.get<string>('POSTGRES_USER'),
    password: configService.get<string>('POSTGRES_PASSWORD'),
    database: configService.get<string>('POSTGRES_DB'),
    entities: ['dist/**/*.entity.js'],
    migrations: ['dist/db/migrations/*.js'],
    synchronize: false,
    logging: true,
}

const dataSource = new DataSource(dataSourceOptions)

export default dataSource;
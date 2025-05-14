import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';

import { UserService } from './user.service';
import { UserController } from './user.controller';
import { UserEntity } from '../../models/user/user.entity';
import { ContactInfoEntity } from '../../models/contact-info/contact-info.entity';
import { UserRepository } from './repository/user.repository';
import { ContactInfoRepository } from './repository/contactInfo.repository';
import { OrderInfrastructureModule } from '../contact-info-order-checker/contact-info-order-checker.module';

@Module({
    imports: [
        TypeOrmModule.forFeature([UserEntity, ContactInfoEntity]),
        PassportModule.register({ defaultStrategy: 'jwt' }),
        OrderInfrastructureModule,
    ],
    controllers: [UserController],
    providers: [
        UserService,
        UserRepository,
        ContactInfoRepository,
    ],
    exports: [UserService],
})
export class UserModule {}
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';

import { UserService } from './user.service';
import { UserController } from './user.controller';
import { UserEntity } from '../../models/user/user.entity';
import { ContactInfoEntity } from '../../models/contact-info/contact-info.entity';


@Module({
    imports: [
        TypeOrmModule.forFeature([UserEntity, ContactInfoEntity]),
        PassportModule.register({ defaultStrategy: 'jwt' }),
    ],
    controllers: [UserController],
    providers: [UserService],
    exports: [UserService],
})
export class UserModule {}
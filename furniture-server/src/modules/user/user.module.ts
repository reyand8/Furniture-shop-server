import { TypeOrmModule } from '@nestjs/typeorm';
import { forwardRef, Module } from '@nestjs/common';

import { UserService } from './user.service';
import { AuthModule } from '../auth/auth.module';
import { UserController } from './user.controller';
import { UserEntity } from '../../models/user/user.entity';
import { JwtStrategy } from '../auth/auth-guard/jwt.strategy';
import { ContactInfo } from '../../models/contact-info/contact-info.entity';


@Module({
    imports: [
        TypeOrmModule.forFeature([UserEntity, ContactInfo]),
        forwardRef((): typeof AuthModule => AuthModule),
    ],
    controllers: [UserController],
    providers: [JwtStrategy, UserService],
    exports: [UserService],
})
export class UserModule {}

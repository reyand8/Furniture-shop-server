import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ContactInfo } from '../../models/contact-info/contact-info.entity';
import { UserEntity } from '../../models/user/user.entity';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';


@Module({
    imports: [
        TypeOrmModule.forFeature([UserEntity, ContactInfo]),
        JwtModule.register({ secret: process.env.JWT_SECRET_KEY, signOptions: { expiresIn: '120m' } })
    ],
    controllers: [AuthController],
    providers: [AuthService],
    exports: [AuthService, JwtModule],
})
export class AuthModule {}
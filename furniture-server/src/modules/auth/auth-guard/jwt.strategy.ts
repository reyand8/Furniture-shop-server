import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';

import { UserEntity } from '../../../models/user/user.entity';
import { AuthService } from '../auth.service';


/**
 * Strategy for validating JWT tokens using Passport.
 */
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {

    constructor(
        private authService: AuthService,
        private configService: ConfigService,
    ) {
        const jwtSecret: string | undefined = configService.get<string>('JWT_SECRET_KEY');

        if (!jwtSecret) {
            throw new Error('JWT_SECRET_KEY is not defined');
        }

        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: jwtSecret,
        });
    }

    /**
     * Validates the JWT payload and returns the corresponding user.
     * @param payload - The decoded JWT payload containing user information.
     * @returns The user entity associated with the JWT.
     * @throws UnauthorizedException if the user is not found.
     */
    async validate(payload: any): Promise<Partial<UserEntity>> {
        const user: Partial<UserEntity>  = await this.authService.findBy('id', payload.sub);
        if (!user) {
            throw new UnauthorizedException('User not found');
        }
        return user;
    }
}

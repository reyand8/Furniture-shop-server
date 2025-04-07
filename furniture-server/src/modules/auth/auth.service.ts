import { BadRequestException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { JwtService } from '@nestjs/jwt';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcryptjs';

import { UserEntity } from '../../models/user/user.entity';
import { ITokens, IUserRegister } from './auth.interface';


@Injectable()
export class AuthService {
    constructor(
      @InjectRepository(UserEntity)
      private userRepository: Repository<UserEntity>,
      private jwtService: JwtService
    ) {}

    /**
     * Hashes a password using bcrypt.
     * @param password - The plain text password to be hashed.
     * @returns A promise that resolves to the hashed password.
     */
    private async hashPassword(password: string): Promise<string> {
        return bcrypt.hash(password, 10);
    }

    /**
     * Checks if a user with the given email already exists.
     * @param email - The email address to check.
     * @returns A promise that resolves to a boolean indicating whether the email exists.
     */
    async emailExists(email: string): Promise<boolean> {
        const existingUser: UserEntity | null = await this.userRepository.findOne({ where: { email } });
        return !!existingUser;
    }

    /**
     * Generates JWT tokens (access and refresh) for the user.
     * @param user - The user for whom the tokens are being generated.
     * @returns A promise that resolves to an object containing access and refresh tokens.
     */
    private async generateTokens(user: UserEntity): Promise<ITokens> {
        const payload: { email: string; sub: string } = { email: user.email, sub: user.id };
        const access_token: string = this.jwtService.sign(payload);
        const refresh_token: string = this.jwtService.sign(payload, { expiresIn: '1d' });
        return { access_token, refresh_token };
    }

    /**
     * Registers a new user and returns JWT tokens.
     * @param regUser - The user registration details.
     * @returns A promise that resolves to an object containing access and refresh tokens.
     * @throws BadRequestException if the email is already in use.
     */
    async register(regUser: IUserRegister): Promise<ITokens> {
        const { email, password } = regUser;

        if (await this.emailExists(email)) {
            throw new BadRequestException({
                statusCode: HttpStatus.BAD_REQUEST,
                message: 'This email is already in use',
                error: 'Bad Request',
            });
        }

        regUser.password = await this.hashPassword(password);
        const user = await this.userRepository.save(regUser);

        if (!user) {
            throw new Error('Create user error');
        }

        const { access_token, refresh_token } = await this.generateTokens(user);
        return { access_token, refresh_token };
    }
}

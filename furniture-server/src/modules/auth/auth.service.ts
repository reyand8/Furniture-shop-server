import {
    BadRequestException, HttpStatus,
    Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { JwtService } from '@nestjs/jwt';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcryptjs';

import { ITokens, IUser, IUserRegister } from './auth.interface';
import { UserEntity } from '../../models/user/user.entity';


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
        const existingUser: UserEntity | null =
            await this.userRepository.findOne({ where: { email } });
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

    /**
     * Logs in a user by generating access and refresh tokens.
     * @param loginUser - The user data used to log in.
     * @returns The access and refresh tokens for the user.
     */
    async login(loginUser: IUser): Promise<ITokens> {
        const { email, id, role } = loginUser;
        const payload: { email: string; sub: string, role: string } =
            { email: email, sub: id, role: role };
        return {
            access_token: this.jwtService.sign(payload),
            refresh_token: this.jwtService.sign(payload, {
                expiresIn: '1d',
            }),
        };
    }

    /**
     * Finds a user by a given field (e.g., id, email, etc.).
     * @param field - The field to find by (e.g., id, email).
     * @param value - The value of the field (e.g., userId or email).
     * @returns The found user entity.
     * @throws BadRequestException if the value is invalid.
     * @throws NotFoundException if the user is not found.
     */
    async findBy(field: string, value: string): Promise<UserEntity> {
        if (!value) {
            throw new BadRequestException('Invalid value');
        }
        const user: UserEntity | null = await this.userRepository.findOne({
            where: { [field]: value },
        });
        if (!user) {
            throw new NotFoundException(`User with ${field}: ${value} not found`);
        }
        return user;
    }

    /**
     * Validates a user by comparing email and password.
     * @param email - The user's email.
     * @param pass - The user's password.
     * @returns The user if credentials are valid, otherwise null.
     */
    async validateUser(email: string, pass: string): Promise<IUser | null> {
        const user: UserEntity | null = await this.userRepository.findOne({ where: { email } });
        if (user && await this.comparePasswords(pass, user.password)) {
            return user;
        }
        return null;
    }

    /**
     * Compares a plaintext password with a hashed password.
     * @param pass - The plaintext password.
     * @param hashedPassword - The hashed password.
     * @returns True if the passwords match, otherwise false.
     */
    async comparePasswords(pass: string, hashedPassword: string): Promise<boolean> {
        return bcrypt.compare(pass, hashedPassword);
    }
}

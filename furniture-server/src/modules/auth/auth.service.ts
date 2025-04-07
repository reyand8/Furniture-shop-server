import { BadRequestException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
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

    /**
     * Logs in a user by generating access and refresh tokens.
     * @param loginUser - The user data used to log in.
     * @returns The access and refresh tokens for the user.
     */
    async login(loginUser: IUser): Promise<ITokens> {
        const { email, id } = loginUser;
        const payload: { email: string; sub: string } = { email: email, sub: id };
        return {
            access_token: this.jwtService.sign(payload),
            refresh_token: this.jwtService.sign(payload, {
                expiresIn: '1d',
            }),
        };
    }

    /**
     * Validates a user by comparing email and password.
     * @param email - The user's email.
     * @param pass - The user's password.
     * @returns The user if credentials are valid, otherwise null.
     */
    async validateUser(email: string, pass: string): Promise<IUser | null> {
        const user: UserEntity | null = await this.userRepository.findOne({ where: { email } });
        if (user && (await bcrypt.compare(pass, user.password))) {
            return user;
        }
        return null;
    }

    /**
     * Finds a user by their ID.
     * @param userId - The ID of the user.
     * @returns The found user entity.
     * @throws BadRequestException if the ID is invalid.
     * @throws NotFoundException if the user is not found.
     */
    async findById(userId: string): Promise<UserEntity> {
        if (!userId) {
            throw new BadRequestException('Invalid ID');
        }

        const user: UserEntity | null = await this.userRepository.findOne({
            where: { id: userId },
        });

        if (!user) {
            throw new NotFoundException(`User with id: ${userId} not found`);
        }

        return user;
    }
}

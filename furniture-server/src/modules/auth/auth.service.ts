import {
    BadRequestException, ForbiddenException, HttpStatus,
    Injectable, UnauthorizedException
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';

import { ITokens, IUser } from './auth.interface';
import { UserEntity } from '../../models/user/user.entity';
import { LoginUserDto } from './dto/loginUser.dto';
import { RegisterUserDto } from './dto/registerUser.dto';
import { ERROR_MESSAGES } from '../../common/constants';
import { UserService } from '../user/user.service';

const {
    INACTIVE_USER_PROFILE,
    INVALID_CREDENTIALS,
    EXISTS_EMAIL,
    INVALID_REQUEST,
    ERROR_CREATE_USER,
} = ERROR_MESSAGES


@Injectable()
export class AuthService {
    constructor(
      private userService: UserService,
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
            await this.userService.findBy('email', email);
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
    async register(regUser: RegisterUserDto): Promise<ITokens> {
        const { email, password } = regUser;
        if (await this.emailExists(email)) {
            throw new BadRequestException({
                statusCode: HttpStatus.BAD_REQUEST,
                message: EXISTS_EMAIL,
                error: INVALID_REQUEST,
            });
        }
        regUser.password = await this.hashPassword(password);
        const user: UserEntity = await this.userService.createProfile(regUser);

        if (!user) {
            throw new Error(ERROR_CREATE_USER);
        }

        const { access_token, refresh_token } = await this.generateTokens(user);
        return { access_token, refresh_token };
    }

    /**
     * Authenticates a user and generates access and refresh tokens.
     *
     * Validates the user's credentials and active status. Throws an exception
     * if authentication fails or the user is inactive.
     *
     * @param loginUserDto - DTO containing the user's email and password.
     * @returns An object containing the access and refresh tokens.
     * @throws UnauthorizedException if credentials are invalid.
     * @throws ForbiddenException if the user account is inactive.
     */
    async login(loginUserDto: LoginUserDto): Promise<ITokens> {
        const { email, password } = loginUserDto;
        const user: IUser | null = await this.validateUser(email, password);
        if (!user) {
            throw new UnauthorizedException(INVALID_CREDENTIALS);
        }
        if (!user.isActive) {
            throw new ForbiddenException(INACTIVE_USER_PROFILE);
        }
        const payload: { email: string; sub: string, role: string } =
            { email: user.email, sub: user.id, role: user.role };
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
        const user: UserEntity | null = await this.userService.findBy('email', email);
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

import { Body, Controller, Post, UnauthorizedException } from '@nestjs/common';

import { AuthService } from './auth.service';
import { ITokens, IUser } from './auth.interface';
import { RegisterUserDto } from './dto/registerUser.dto';
import { LoginUserDto } from './dto/loginUser.dto';


/**
 * `AuthController` handles HTTP routes related to authentication such as user registration and login.
 */
@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    /**
     * Handles the registration of a new user.
     * @param registerUserDto - Data Transfer Object containing registration details.
     * @returns A Promise containing access and refresh tokens.
     * @throws HttpException if validation fails or an error occurs during registration.
     */
    @Post('register')
    async register(@Body() registerUserDto: RegisterUserDto): Promise<ITokens> {
        return await this.authService.register(registerUserDto);
    }

    /**
     * Handles user login.
     * @param loginUserDto - Data Transfer Object containing login credentials.
     * @returns A Promise containing access and refresh tokens.
     * @throws BadRequestException if input data is invalid.
     * @throws UnauthorizedException if credentials are incorrect.
     */
    @Post('login')
    async login(@Body() loginUserDto: LoginUserDto): Promise<ITokens> {
        const { email, password } = loginUserDto;

        const user: IUser | null = await this.authService.validateUser(email, password);

        if (!user) {
            throw new UnauthorizedException('Invalid credentials');
        }

        return await this.authService.login(user);
    }

}
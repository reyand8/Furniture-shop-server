import { Body, Controller, Post } from '@nestjs/common';

import { AuthService } from './auth.service';
import { ITokens } from './auth.interface';
import { RegisterUserDto } from './dto/registerUser.dto';


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

}
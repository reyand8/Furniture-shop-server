import {
    Body, Controller, Post, UseGuards
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

import { AuthService } from './auth.service';
import { ITokens } from './auth.interface';
import { RegisterUserDto } from './dto/registerUser.dto';
import { LoginUserDto } from './dto/loginUser.dto';
import { RegisterByAdminDto } from './dto/registerByAdmin.dto';
import { Roles } from './roles-guard/roles.decorator';
import { EUserRole } from '../../models/user/user.entity';
import { RolesGuard } from './roles-guard/roles.guard';


/**
 * `AuthController` handles HTTP routes related to authentication such as user registration and login.
 */
@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    /**
     * Handles the registration of a new admin.
     * @param registerByAdminDto - Data Transfer Object containing registration details.
     * @returns A Promise containing access and refresh tokens.
     * @throws HttpException if validation fails or an error occurs during registration.
     */
    @Post('register-by-admin')
    @Roles(EUserRole.SUPER_ADMIN)
    @UseGuards(AuthGuard('jwt'), RolesGuard)
    async registerByAdmin(@Body() registerByAdminDto: RegisterByAdminDto): Promise<ITokens> {
        return this.authService.register(registerByAdminDto);
    }

    /**
     * Handles the registration of a new user.
     * @param registerUserDto - Data Transfer Object containing registration details.
     * @returns A Promise containing access and refresh tokens.
     * @throws HttpException if validation fails or an error occurs during registration.
     */
    @Post('register')
    async register(@Body() registerUserDto: RegisterUserDto): Promise<ITokens> {
        return this.authService.register(registerUserDto);
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
        return this.authService.login(loginUserDto);
    }
}
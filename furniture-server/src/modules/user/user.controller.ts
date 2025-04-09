import {
    Controller, Get, Body,
    Request, Put, UseGuards
} from '@nestjs/common';

import { UserService } from './user.service';
import { UpdateUserDto } from './dto/updateUser.dto';
import { UserEntity } from '../../models/user/user.entity';
import { JwtAuthGuard } from '../auth/auth-guard/jwt-auth.guard';


@Controller('users')
export class UserController {
    constructor(private readonly userService: UserService) {}

    /**
     * Get the profile of the currently authenticated user.
     * @param req The request object containing the current user's information.
     * @returns The profile of the current user.
     */
    @Get('me')
    @UseGuards(JwtAuthGuard)
    getProfile(@Request() req: any): Promise<boolean | UserEntity> {
        return req.user;
    }

    /**
     * Update the current user's profile.
     * @param updateUserDto The data to update the user's profile.
     * @param req The request object containing the current user's information.
     * @returns The updated user.
     */
    @Put('me')
    @UseGuards(JwtAuthGuard)
    async updateProfile(@Body() updateUserDto: UpdateUserDto, @Request() req: any): Promise<UserEntity> {
        return this.userService.update(req.user, updateUserDto);
    }
}
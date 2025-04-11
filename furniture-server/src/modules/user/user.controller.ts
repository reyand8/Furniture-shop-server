import {
    Controller, Get, Body,
    Request, Put, UseGuards, Post, Delete, Param
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

import { UserService } from './user.service';
import { UpdateUserDto } from './dto/updateUser.dto';
import { UserEntity } from '../../models/user/user.entity';
import { CreateContactInfoDto } from './dto/createСontactInfo.dto';
import { UpdateContactInfoDto } from './dto/updateContactInfo.dto';
import { ContactInfoEntity } from '../../models/contact-info/contact-info.entity';


@Controller('users')
export class UserController {
    constructor(private readonly userService: UserService) {}

    /**
     * Get the profile of the currently authenticated user.
     * @param req The request object containing the current user's information.
     * @returns The profile of the current user.
     */
    @Get('me')
    @UseGuards(AuthGuard('jwt'))
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
    @UseGuards(AuthGuard('jwt'))
    async updateProfile(@Body() updateUserDto: UpdateUserDto, @Request() req: any): Promise<UserEntity> {
        return this.userService.updateProfile(req.user, updateUserDto);
    }

    /**
     * Get all contact information for the currently authenticated user.
     * @param req The request object containing the current user's information.
     * @returns An array of contact information.
     */
    @Get('contact-info')
    @UseGuards(AuthGuard('jwt'))
    async getContactInfo(@Request() req: any): Promise<ContactInfoEntity[]> {
        return this.userService.getContactInfo(req.user.id);
    }

    /**
     * Create new contact information for the currently authenticated user.
     * @param createContactInfoDto The data to create new contact information.
     * @param req The request object containing the current user's information.
     * @returns The newly created contact information.
     */
    @Post('contact-info')
    @UseGuards(AuthGuard('jwt'))
    async createContactInfo(
        @Body() createContactInfoDto: CreateContactInfoDto,
        @Request() req: any): Promise<ContactInfoEntity> {
        return this.userService.createContactInfo(createContactInfoDto, req.user.id);
    }

    /**
     * Get contact information by ID for the currently authenticated user.
     * @param contactInfoId The ID of the contact information to retrieve.
     * @param req The request object containing the current user's information.
     * @returns The contact information matching the provided ID.
     */
    @Get('contact-info/:id')
    @UseGuards(AuthGuard('jwt'))
    async getContactInfoById(
        @Param('id') contactInfoId: string,
        @Request() req: any): Promise<ContactInfoEntity> {
        return this.userService.getContactInfoByIdAndUser(contactInfoId, req.user.id);
    }

    /**
     * Update contact information by ID for the currently authenticated user.
     * @param contactInfoId The ID of the contact information to update.
     * @param updateContactInfoDto The data to update the contact information.
     * @param req The request object containing the current user's information.
     * @returns The updated contact information.
     */
    @Put('contact-info/:id')
    @UseGuards(AuthGuard('jwt'))
    async updateContactInfoById(
        @Param('id') contactInfoId: string,
        @Body() updateContactInfoDto: UpdateContactInfoDto,
        @Request() req: any
    ): Promise<ContactInfoEntity> {
        return this.userService.updateContactInfoById(contactInfoId, updateContactInfoDto, req.user.id);
    }

    /**
     * Delete contact information by ID for the currently authenticated user.
     * @param contactInfoId The ID of the contact information to delete.
     * @param req The request object containing the current user's information.
     * @returns A promise that resolves once the contact information is deleted.
     */
    @Delete('contact-info/:id')
    @UseGuards(AuthGuard('jwt'))
    async delete(
        @Param('id') contactInfoId: string,
        @Request() req: any): Promise<void> {
        return this.userService.deleteContactInfo(contactInfoId, req.user.id);
    }
}
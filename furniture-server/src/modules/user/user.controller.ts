import {
    Controller, Get, Body,
    Request, Put, UseGuards, Post, Delete, Param, Query, UseInterceptors
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

import { UserService } from './user.service';
import { UpdateUserDto } from './dto/updateUser.dto';
import { EUserRole, UserEntity } from '../../models/user/user.entity';
import { CreateContactInfoDto } from './dto/createСontactInfo.dto';
import { UpdateContactInfoDto } from './dto/updateContactInfo.dto';
import { ContactInfoEntity } from '../../models/contact-info/contact-info.entity';
import { Roles } from '../auth/roles-guard/roles.decorator';
import { RolesGuard } from '../auth/roles-guard/roles.guard';
import { GetAllUsersDto } from './dto/getAllUsers.dto';
import { UpdateUserRoleDto } from './dto/updateUserRole.dto';


@Controller('users')
export class UserController {
    constructor(private readonly userService: UserService) {}

    /**
     * Get a list of all users.
     * Accessible by SUPER_ADMIN and ADMIN roles.
     *
     * @param getAllUsersDto - DTO with filtering or pagination options for user list.
     * @returns A promise resolving to a list of users with partial information.
     */
    @Get('')
    @Roles(EUserRole.SUPER_ADMIN, EUserRole.ADMIN)
    @UseGuards(AuthGuard('jwt'), RolesGuard)
    getAllUsers(
        @Query() getAllUsersDto: GetAllUsersDto
    ): Promise<Partial<UserEntity>[]> {
        return this.userService.getAllUsers(getAllUsersDto);
    }

    /**
     * Update the role of a specific user.
     * Accessible only by SUPER_ADMIN.
     *
     * @param userId - ID of the user whose role is being updated.
     * @param updateUserRoleDto - DTO containing the new role.
     * @returns A promise resolving to the updated user with partial information.
     */
    @Put(':id')
    @Roles(EUserRole.SUPER_ADMIN)
    @UseGuards(AuthGuard('jwt'), RolesGuard)
    updateUserFields(
        @Param('id') userId: string,
        @Body() updateUserRoleDto: UpdateUserRoleDto
    ): Promise<Partial<UserEntity>> {
        return this.userService.updateUserFields(userId, updateUserRoleDto);
    }

    /**
     * Get the profile of the currently authenticated user.
     * @param req The request object containing the current user's information.
     * @returns The profile of the current user.
     */
    @Get('me')
    @UseGuards(AuthGuard('jwt'))
    getProfile(@Request() req: any): Promise<Partial<UserEntity>> {
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
    updateProfile(
        @Body() updateUserDto: UpdateUserDto,
        @Request() req: any
    ): Promise<Partial<UserEntity>> {
        return this.userService.updateProfile(req.user, updateUserDto);
    }

    /**
     * Get all contact information for the currently authenticated user.
     * @param req The request object containing the current user's information.
     * @returns An array of contact information.
     */
    @Get('contact-info')
    @UseGuards(AuthGuard('jwt'))
    getContactInfo(@Request() req: any): Promise<ContactInfoEntity[]> {
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
    createContactInfo(
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
    getContactInfoById(
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
    updateContactInfoById(
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
    delete(
        @Param('id') contactInfoId: string,
        @Request() req: any): Promise<void> {
        return this.userService.deleteContactInfo(contactInfoId, req.user.id);
    }
}
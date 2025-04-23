import {
    IsEmail, IsEnum, IsNotEmpty, IsString,
    MaxLength, MinLength
} from 'class-validator';

import { EUserRole } from '../../../models/user/user.entity';


export class RegisterByAdminDto {
    @IsString({ message: 'First name must be a string.' })
    @IsNotEmpty({ message: 'First name is required.' })
    @MaxLength(60, { message: 'First name can not be longer than 60 characters.' })
    firstName: string;

    @IsString({ message: 'Last name must be a string.' })
    @IsNotEmpty({ message: 'Last name is required.' })
    @MaxLength(60, { message: 'Last name can not be longer than 60 characters.' })
    lastName: string;

    @IsString({ message: 'Email must be a string.' })
    @IsEmail({}, { message: 'Please provide a valid email address.' })
    @IsNotEmpty({ message: 'Email is required.' })
    @MaxLength(60, { message: 'Email can not be longer than 60 characters.' })
    email: string;

    @IsString({ message: 'Password must be a string.' })
    @MinLength(6, { message: 'Password must be at least 6 characters long.' })
    @MaxLength(30, { message: 'Password can not be longer than 30 characters.' })
    @IsNotEmpty({ message: 'Password is required.' })
    password: string;

    @IsEnum(EUserRole, { message: 'Role must be one of USER, ADMIN, or SUPER_ADMIN.' })
    @IsNotEmpty({ message: 'Role is required.' })
    role: EUserRole;
}
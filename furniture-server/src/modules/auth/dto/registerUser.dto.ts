import {
    IsEmail, IsNotEmpty,
    IsString, MaxLength,
    MinLength
} from 'class-validator';
import { Transform } from 'class-transformer';


export class RegisterUserDto {
    @IsString({ message: 'First name must be a string.' })
    @IsNotEmpty({ message: 'First name is required.' })
    @MaxLength(60, { message: 'First name can not be longer than 60 characters.' })
    @Transform(({ value }: { value: string }): string => value?.trim())
    firstName: string;

    @IsString({ message: 'Last name must be a string.' })
    @IsNotEmpty({ message: 'Last name is required.' })
    @MaxLength(60, { message: 'Last name can not be longer than 60 characters.' })
    @Transform(({ value }: { value: string }): string => value?.trim())
    lastName: string;

    @IsString({ message: 'Email must be a string.' })
    @IsEmail({}, { message: 'Please provide a valid email address.' })
    @IsNotEmpty({ message: 'Email is required.' })
    @MaxLength(60, { message: 'Email can not be longer than 60 characters.' })
    @Transform(({ value }: { value: string }): string => value?.trim())
    email: string;

    @IsString({ message: 'Password must be a string.' })
    @MinLength(6, { message: 'Password must be at least 6 characters long.' })
    @MaxLength(30, { message: 'Password can not be longer than 30 characters.' })
    @IsNotEmpty({ message: 'Password is required.' })
    @Transform(({ value }: { value: string }): string => value?.trim())
    password: string;
}
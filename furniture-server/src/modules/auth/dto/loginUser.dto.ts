import {
    IsEmail, IsNotEmpty, IsString,
    MaxLength, MinLength } from 'class-validator';
import { Transform } from 'class-transformer';


export class LoginUserDto {
    @IsString({ message: 'Email must be a string.' })
    @IsEmail({}, { message: 'Please provide a valid email address.' })
    @IsNotEmpty({message: 'Email can not be empty'})
    @MaxLength(60, { message: 'Email can not be longer than 60 characters.' })
    @Transform(({ value }: { value: string }): string => value?.trim())
    email: string;

    @IsString({ message: 'Password must be a string.' })
    @IsNotEmpty({message: 'Password can not be empty'})
    @MinLength(6, { message: 'Password must be at least 6 characters long.' })
    @MaxLength(30, { message: 'Password can not be longer than 30 characters.' })
    @Transform(({ value }: { value: string }): string => value?.trim())
    password: string;
}
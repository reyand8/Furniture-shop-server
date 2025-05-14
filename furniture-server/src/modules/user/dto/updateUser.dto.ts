import {
    IsBoolean, IsEmail,
    IsOptional, IsString,
    MaxLength } from 'class-validator';
import { Transform } from 'class-transformer';


export class UpdateUserDto {

    @IsEmail()
    @IsOptional()
    @MaxLength(60, { message: 'Email must be at most 60 characters.' })
    @Transform(({ value }: { value: string }): string => value?.trim())
    email: string;

    @IsString()
    @MaxLength(60, { message: 'First name must be at most 60 characters.' })
    @IsOptional()
    @Transform(({ value }: { value: string }): string => value?.trim())
    firstName: string;

    @IsString()
    @MaxLength(60, { message: 'Last name must be at most 60 characters.' })
    @IsOptional()
    @Transform(({ value }: { value: string }): string => value?.trim())
    lastName: string;

    @IsOptional()
    @IsBoolean({ message: 'User status must be true or false.' })
    isActive: boolean;
}

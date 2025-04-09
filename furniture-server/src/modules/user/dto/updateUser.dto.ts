import { IsEmail, IsOptional, IsString, MaxLength } from 'class-validator';


export class UpdateUserDto {

    @IsEmail()
    @IsOptional()
    @MaxLength(60, { message: 'Email must be at most 60 characters.' })
    email: string;

    @IsString()
    @MaxLength(60, { message: 'First name must be at most 60 characters.' })
    @IsOptional()
    firstName: string;

    @IsString()
    @MaxLength(60, { message: 'Last name must be at most 60 characters.' })
    @IsOptional()
    lastName: string;
}

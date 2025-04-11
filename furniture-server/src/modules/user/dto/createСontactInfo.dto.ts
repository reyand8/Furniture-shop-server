import {
    IsString, IsNotEmpty,
    IsOptional, MaxLength
} from 'class-validator';


export class CreateContactInfoDto {
    @IsString({message: 'Phone number must be a string'})
    @MaxLength(13, { message: 'Phone number must be at most 13 characters.' })
    @IsNotEmpty({message: 'Phone is required'})
    phone: string;

    @IsString({message: 'Address must be a string'})
    @MaxLength(200, { message: 'Address must be at most 200 characters.' })
    @IsNotEmpty({message: 'Address is required'})
    address: string;

    @IsString({message: 'Zip code must be a string'})
    @MaxLength(30, { message: 'Zip code must be at most 30 characters.' })
    @IsNotEmpty({message: 'Zip code is required'})
    zipCode: string;

    @IsString({message: 'City must be a string'})
    @MaxLength(100, { message: 'City must be at most 100 characters.' })
    @IsNotEmpty({message: 'City is required'})
    city: string;

    @IsString({message: 'Region must be a string'})
    @MaxLength(100, { message: 'Region must be at most 100 characters.' })
    @IsNotEmpty({message: 'Region is required'})
    region: string;

    @IsString({message: 'Country must be a string'})
    @IsNotEmpty({message: 'Country is required'})
    country: string;

    @IsString()
    @IsOptional()
    @MaxLength(100, { message: 'Company name must be at most 100 characters.' })
    companyName: string;

    @IsString()
    @IsOptional()
    @MaxLength(40, { message: 'Company tax id must be at most 40 characters.' })
    companyTaxId: string;
}
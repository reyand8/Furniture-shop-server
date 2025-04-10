import { IsString, IsOptional, MaxLength } from 'class-validator';


export class UpdateContactInfoDto {
    @IsString()
    @MaxLength(13, { message: 'Phone number must be at most 13 characters.' })
    @IsOptional()
    phone: string;

    @IsString()
    @MaxLength(200, { message: 'Address must be at most 200 characters.' })
    @IsOptional()
    address: string;

    @IsString()
    @MaxLength(30, { message: 'Zip code must be at most 30 characters.' })
    @IsOptional()
    zipCode: string;

    @IsString()
    @IsOptional()
    @MaxLength(100, { message: 'City must be at most 100 characters.' })
    city: string;

    @IsString()
    @IsOptional()
    @MaxLength(100, { message: 'Region must be at most 100 characters.' })
    region: string;

    @IsString()
    @IsOptional()
    country: string;

    @IsString()
    @IsOptional()
    @MaxLength(100, { message: 'Company name must be at most 100 characters.' })
    companyName: string;

    @IsString()
    @MaxLength(40, { message: 'Company tax id must be at most 40 characters.' })
    @IsOptional()
    companyTaxId: string;
}
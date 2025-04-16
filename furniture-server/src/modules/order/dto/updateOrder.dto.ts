import { IsOptional, IsString } from 'class-validator';


export class UpdateOrderDto {
    @IsString()
    @IsOptional()
    contactInfoId?: string;

    @IsString()
    @IsOptional()
    notes?: string;
}

import { IsOptional, IsString, IsUUID } from 'class-validator';


export class UpdateOrderDto {
    @IsOptional()
    @IsUUID('4', { message: 'Contact info ID must be a valid UUID.' })
    contactInfoId?: string;

    @IsString()
    @IsOptional()
    notes?: string;
}

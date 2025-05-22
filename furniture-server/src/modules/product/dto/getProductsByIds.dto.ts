import { IsString, IsArray } from 'class-validator';


export class GetProductsByIdsDto {
    @IsArray({ message: 'Ids list must be an array.' })
    @IsString({ each: true, message: 'Each id must be a string.' })
    ids: string[];
}
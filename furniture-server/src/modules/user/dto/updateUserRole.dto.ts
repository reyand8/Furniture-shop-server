import {IsBoolean, IsEnum, IsOptional} from 'class-validator';

import { EUserRole } from '../../../models/user/user.entity';


export class UpdateUserRoleDto {
    @IsOptional()
    @IsEnum(EUserRole, { message: 'Role must be one of USER, ADMIN, or SUPER_ADMIN.' })
    role: EUserRole;

    @IsOptional()
    @IsBoolean({ message: 'User status must be true or false.' })
    isActive: boolean;
}
import { IsEnum, IsNotEmpty } from 'class-validator';

import { EUserRole } from '../../../models/user/user.entity';


export class UpdateUserRoleDto {
    @IsEnum(EUserRole, { message: 'Role must be one of USER, ADMIN, or SUPER_ADMIN.' })
    @IsNotEmpty({ message: 'Role is required.' })
    role: EUserRole;
}
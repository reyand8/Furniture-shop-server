import { CustomDecorator, SetMetadata } from '@nestjs/common';

import { EUserRole } from '../../../models/user/user.entity';


export const ROLES_KEY = 'role';

export const Roles = (...role: EUserRole[]): CustomDecorator =>
    SetMetadata(ROLES_KEY, role);
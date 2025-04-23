import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

import { EUserRole, UserEntity } from '../../../models/user/user.entity';
import { ROLES_KEY } from './roles.decorator';


@Injectable()
export class RolesGuard implements CanActivate {
    constructor(private reflector: Reflector) {}

    canActivate(context: ExecutionContext): boolean {
        const requiredRoles: EUserRole[] =
            this.reflector.getAllAndOverride<EUserRole[]>(ROLES_KEY, [
            context.getHandler(),
            context.getClass(),
        ]);
        if (!requiredRoles) {
            return true;
        }
        const request = context.switchToHttp().getRequest();
        const user: Partial<UserEntity> = request.user;

        return requiredRoles.some((role: EUserRole): boolean | undefined =>
            user.role?.includes(role));
    }
}


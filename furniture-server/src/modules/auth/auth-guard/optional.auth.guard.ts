import { ExecutionContext, Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

/**
 * Guard that optionally authenticates a user using JWT.
 *
 * If a valid JWT token is present, the user is authenticated and set on the request.
 * If no token or an invalid token is present, the request proceeds without authentication (user is null).
 */
@Injectable()
export class OptionalJwtAuthGuard extends AuthGuard('jwt') {
    handleRequest(err: any, user: any, info: any, context: ExecutionContext) {
        if (err || !user) {
            return null;
        }
        return user;
    }
}

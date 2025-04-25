import {
    CallHandler,
    ExecutionContext,
    Injectable,
    NestInterceptor,
    InternalServerErrorException,
} from '@nestjs/common';
import { Observable, catchError, throwError } from 'rxjs';
import { HttpException } from '@nestjs/common';

import { ERROR_MESSAGES } from './constants';


const { ERROR_SERVER } = ERROR_MESSAGES

@Injectable()
export class ErrorInterceptor implements NestInterceptor {
    intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
        return next.handle().pipe(
            catchError((err) => {
                if (err instanceof HttpException) {
                    return throwError((): HttpException => err);
                }
                return throwError(
                    () =>
                        new InternalServerErrorException(ERROR_SERVER, {
                        cause: err,
                        description: err?.message,
                    }),
                );
            }),
        );
    }
}

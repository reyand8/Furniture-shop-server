import {
    ExecutionContext,
    HttpException,
    HttpStatus,
    InternalServerErrorException,
} from '@nestjs/common';
import { throwError } from 'rxjs';

import { ErrorInterceptor } from '../../common/errorInterceptor';
import { ERROR_MESSAGES } from '../../common/constants';


describe('ErrorInterceptor', () => {
    let interceptor: ErrorInterceptor;

    const mockContext: ExecutionContext = {
        switchToHttp: () => ({
            getRequest: () => ({}),
            getResponse: () => ({}),
        }),
    } as any;

    beforeEach(() => {
        interceptor = new ErrorInterceptor();
    });

    it('should pass through HttpException without wrapping', (done) => {
        const httpError = new HttpException('Bad Request', HttpStatus.BAD_REQUEST);
        const callHandler = {
            handle: () => throwError(() => httpError),
        };

        interceptor.intercept(mockContext, callHandler).subscribe({
            next: () => {},
            error: (err) => {
                expect(err).toBe(httpError);
                done();
            },
        });
    });

    it('should wrap non-HttpException in InternalServerErrorException', (done) => {
        const genericError = new Error('Database failure');
        const callHandler = {
            handle: () => throwError(() => genericError),
        };

        interceptor.intercept(mockContext, callHandler).subscribe({
            next: () => {},
            error: (err) => {
                expect(err).toBeInstanceOf(InternalServerErrorException);
                expect(err.message).toBe(ERROR_MESSAGES.ERROR_SERVER);
                expect(err.cause).toBe(genericError);
                done();
            },
        });
    });
});

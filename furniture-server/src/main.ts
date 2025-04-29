import { NestFactory } from '@nestjs/core';
import {
  BadRequestException, Logger,
  ValidationError, ValidationPipe } from '@nestjs/common';

import { AppModule } from './app.module';
import { ErrorInterceptor } from './common/errorInterceptor';


async function bootstrap(): Promise<void> {

  const PORT: string | 3000 = process.env.PORT ?? 3000
  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix('api');
  app.enableCors();
  app.enableShutdownHooks();
  app.useGlobalInterceptors(new ErrorInterceptor());
  app.useGlobalPipes(new ValidationPipe({
    forbidNonWhitelisted: true,
    whitelist: true,
    transform: false,
    transformOptions: {
      exposeUnsetFields: false
    },
    exceptionFactory: (errors: ValidationError[]): BadRequestException => {
      return new BadRequestException(errors.map(
          (err: ValidationError): {field: string, errors: string[]} => ({
            field: err.property,
            errors: err.constraints ? Object.values(err.constraints) : [],
          })));
    }
  }));

  await app.listen(PORT, (): void => {
    Logger.log(`http://localhost:${PORT}`, `Server starts on host`);
  });
}

bootstrap();
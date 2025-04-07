import { NestFactory } from '@nestjs/core';
import {
  BadRequestException, Logger,
  ValidationError, ValidationPipe } from '@nestjs/common';

import { AppModule } from './app.module';


async function bootstrap(): Promise<void> {

  const PORT: string | 3000 = process.env.PORT ?? 3000
  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix('api');
  app.enableCors();
  app.enableShutdownHooks();

  app.useGlobalPipes(new ValidationPipe({
    forbidNonWhitelisted: true,
    transform: true,
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
import { NestFactory } from '@nestjs/core';
import { Logger } from '@nestjs/common';

import { AppModule } from './app.module';


async function bootstrap(): Promise<void> {

  const PORT: string | 3000 = process.env.PORT ?? 3000
  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix('api');
  app.enableCors();
  app.enableShutdownHooks();

  await app.listen(PORT, (): void => {
    Logger.log(`http://localhost:${PORT}`, `Server starts on host`);
  });
}

bootstrap();
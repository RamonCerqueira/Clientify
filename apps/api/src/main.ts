import { Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import type { Request, Response, NextFunction } from 'express';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';
import { ResponseInterceptor } from './common/interceptors/response.interceptor';
import { env } from './config/env';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { bufferLogs: true });
  const logger = new Logger('Bootstrap');

  app.enableCors({
    origin: env.corsOrigin.split(','),
    credentials: true,
  });

  // Security headers mínimos sem dependências extras.
  app.use((_: Request, response: Response, next: NextFunction) => {
    response.setHeader('X-Content-Type-Options', 'nosniff');
    response.setHeader('X-Frame-Options', 'DENY');
    response.setHeader('Referrer-Policy', 'no-referrer');
    response.setHeader('X-XSS-Protection', '0');
    next();
  });

  // Compatibilidade temporária para clientes que ainda chamam /auth/* sem /api.
  app.use((request: Request, _: Response, next: NextFunction) => {
    if (request.url.startsWith('/auth/')) {
      request.url = `/api${request.url}`;
    }
    next();
  });

  app.setGlobalPrefix('api');
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
    }),
  );
  app.useGlobalFilters(new HttpExceptionFilter());
  app.useGlobalInterceptors(new ResponseInterceptor());

  await app.listen(env.port);
  logger.log(`API disponível em http://localhost:${env.port}/api`);
}

bootstrap();

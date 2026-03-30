import { Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';

@Injectable()
export class TenantMiddleware implements NestMiddleware {
  use(request: Request & { tenantId?: string }, _: Response, next: NextFunction) {
    // O tenant só é exposto no request para telemetria e logging; autorização continua no guard JWT.
    const authorization = request.headers.authorization;
    const token = authorization?.startsWith('Bearer ') ? authorization.slice(7) : undefined;
    if (token) {
      try {
        const payload = JSON.parse(Buffer.from(token.split('.')[1] ?? '', 'base64').toString());
        request.tenantId = typeof payload.tenantId === 'string' ? payload.tenantId : undefined;
      } catch {
        request.tenantId = undefined;
      }
    }
    next();
  }
}

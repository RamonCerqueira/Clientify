import { Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';

@Injectable()
export class TenantMiddleware implements NestMiddleware {
  use(request: Request & { tenantId?: string }, _: Response, next: NextFunction) {
    // O tenant também é extraído cedo para enriquecer logs, auditoria e futuras políticas.
    const authorization = request.headers.authorization;
    const token = authorization?.startsWith('Bearer ') ? authorization.slice(7) : undefined;
    if (token) {
      try {
        const payload = JSON.parse(Buffer.from(token.split('.')[1] ?? '', 'base64').toString());
        request.tenantId = payload.tenantId;
      } catch {
        request.tenantId = undefined;
      }
    }
    next();
  }
}

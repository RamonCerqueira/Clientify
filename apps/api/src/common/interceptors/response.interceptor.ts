import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { map, Observable } from 'rxjs';

@Injectable()
export class ResponseInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    const request = context.switchToHttp().getRequest<{ tenantId?: string }>();
    return next.handle().pipe(
      map((data) => ({
        data,
        meta: {
          tenantId: request.tenantId ?? null,
          timestamp: new Date().toISOString(),
        },
      })),
    );
  }
}

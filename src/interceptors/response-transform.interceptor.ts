import {
  CallHandler,
  ExecutionContext,
  Injectable,
  Logger,
  NestInterceptor,
} from '@nestjs/common';
import { catchError, finalize, map, Observable, throwError } from 'rxjs';

@Injectable()
export class ResponseTransformInterceptor implements NestInterceptor {
  private readonly logger = new Logger(ResponseTransformInterceptor.name);

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    this.logger.log('[Begin] Execution context');

    return next.handle().pipe(
      catchError((err) =>
        throwError(() => {
          return err;
        }),
      ),
      map((data) => {
        const httpContext = context.switchToHttp();

        return {
          statusCode: httpContext.getResponse().statusCode,
          path: httpContext.getRequest().path,
          timestamp: new Date().toISOString(),
          responseSuccess: data,
        };
      }),
      finalize(() => this.logger.log('[End] Execution context')),
    );
  }
}

import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { HttpAdapterHost } from '@nestjs/core';

@Catch()
export class ExceptionThrownFilter implements ExceptionFilter {
  private readonly logger = new Logger(ExceptionThrownFilter.name);

  constructor(private readonly httpAdapterHost: HttpAdapterHost) {}

  catch(exception: any, host: ArgumentsHost): void {
    const { httpAdapter } = this.httpAdapterHost;
    const ctx = host.switchToHttp();

    if (exception instanceof HttpException) {
      this.logger.error(exception.message);
      this.logger.error(exception.getResponse());
      this.logger.error(exception.stack);

      httpAdapter.reply(
        ctx.getResponse(),
        {
          statusCode: exception.getStatus(),
          timestamp: new Date().toISOString(),
          path: httpAdapter.getRequestUrl(ctx.getRequest()),
          responseError: exception.getResponse(),
        },
        exception.getStatus(),
      );

      return;
    }

    this.logger.error(exception.message);
    this.logger.error(exception.stack);

    const responseBody = {
      statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      timestamp: new Date().toISOString(),
      path: httpAdapter.getRequestUrl(ctx.getRequest()),
      responseError: {
        message: exception.message,
      },
    };

    httpAdapter.reply(
      ctx.getResponse(),
      responseBody,
      HttpStatus.INTERNAL_SERVER_ERROR,
    );
  }
}

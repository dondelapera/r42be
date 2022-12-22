import { Injectable, Logger, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';

@Injectable()
export class RequestLoggerMiddleware implements NestMiddleware {
  private readonly logger = new Logger(RequestLoggerMiddleware.name);

  use(req: Request, res: Response, next: NextFunction) {
    this.logger.log(`${req.method}: ${req.originalUrl}`);
    this.logger.debug(`req.body: ${JSON.stringify(req.body, null, 2)}`);
    this.logger.debug(`req.params: ${JSON.stringify(req.params, null, 2)}`);
    this.logger.debug(`req.query: ${JSON.stringify(req.query, null, 2)}`);

    next();
  }
}

import { Injectable, Logger, NestMiddleware } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NextFunction, Request, Response } from 'express';

@Injectable()
export class SlowdownMiddleware implements NestMiddleware {
  private readonly logger = new Logger(SlowdownMiddleware.name);
  private readonly slowdownInterval = 2000;

  constructor(private readonly configService: ConfigService) {}

  use(_req: Request, _res: Response, next: NextFunction) {
    if (this.configService.getOrThrow('NODE_ENV') === 'development') {
      this.logger.warn(`Slowdown request for ${this.slowdownInterval}ms`);
      new Promise((resolve) => setTimeout(resolve, this.slowdownInterval)).then(
        next,
      );
    }
  }
}

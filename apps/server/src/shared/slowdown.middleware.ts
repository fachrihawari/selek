import { NextFunction, Request, Response } from 'express';

const SLOWDOWN_INTERVAL = 2000;

export async function slowdownMiddleware(
  _req: Request,
  _res: Response,
  next: NextFunction,
) {
  if (process.env.NODE_ENV === 'development') {
    console.log(`Slowdown request for ${SLOWDOWN_INTERVAL}ms`);
    await new Promise((resolve) => setTimeout(resolve, SLOWDOWN_INTERVAL));
  }
  next();
}

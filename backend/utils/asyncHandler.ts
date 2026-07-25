import { Request, Response, NextFunction, RequestHandler } from 'express';

/**
 * Wraps an async Express route handler so rejected promises are passed to
 * next(err) automatically, instead of needing a try/catch in every controller.
 */
export const asyncHandler =
  (fn: (req: Request, res: Response, next: NextFunction) => Promise<unknown>): RequestHandler =>
  (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
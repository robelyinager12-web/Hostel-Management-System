import { Request, Response, NextFunction } from 'express';

interface AppError {
  status?: number;
  message?: string;
}

export function errorHandler(err: AppError, req: Request, res: Response, next: NextFunction) {
  const status = err.status || 500;
  const message = err.message || 'Something went wrong on our end';

  if (status === 500) {
    console.error(err);
  }

  res.status(status).json({ success: false, message });
}
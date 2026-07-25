import { Response } from 'express';

interface ApiResponsePayload<T = unknown> {
  success: boolean;
  message: string;
  data?: T;
}

export function apiResponse<T>(
  res: Response,
  statusCode: number,
  message: string,
  data?: T,
): Response {
  const payload: ApiResponsePayload<T> = {
    success: statusCode < 400,
    message,
  };

  if (data !== undefined) {
    payload.data = data;
  }

  return res.status(statusCode).json(payload);
}
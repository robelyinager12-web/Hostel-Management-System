import { Request, Response, NextFunction } from 'express';
import * as tokenService from '../services/tokenService';

declare global {
  namespace Express {
    interface Request {
      user?: { userId: string; role: string };
    }
  }
}

export function authMiddleware(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;

  if (!authHeader?.startsWith('Bearer ')) {
    return res.status(401).json({ success: false, message: 'No access token provided' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const payload = tokenService.verifyAccessToken(token);
    req.user = { userId: payload.userId, role: payload.role };
    next();
  } catch {
    return res.status(401).json({ success: false, message: 'Invalid or expired access token' });
  }
}
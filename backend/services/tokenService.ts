import jwt, { JwtPayload } from 'jsonwebtoken';

const ACCESS_SECRET = process.env.JWT_ACCESS_SECRET as string;
const REFRESH_SECRET = process.env.JWT_REFRESH_SECRET as string;
const ACCESS_EXPIRES_IN = process.env.JWT_ACCESS_EXPIRES_IN || '15m';
const REFRESH_EXPIRES_IN = process.env.JWT_REFRESH_EXPIRES_IN || '30d';

interface AccessTokenPayload {
  userId: string;
  role: string;
}

interface RefreshTokenPayload {
  userId: string;
}

export function signAccessToken(payload: AccessTokenPayload): string {
  return jwt.sign(payload, ACCESS_SECRET, { expiresIn: ACCESS_EXPIRES_IN });
}

export function signRefreshToken(payload: RefreshTokenPayload): string {
  return jwt.sign(payload, REFRESH_SECRET, { expiresIn: REFRESH_EXPIRES_IN });
}

export function verifyAccessToken(token: string): AccessTokenPayload & JwtPayload {
  return jwt.verify(token, ACCESS_SECRET) as AccessTokenPayload & JwtPayload;
}

export function verifyRefreshToken(token: string): RefreshTokenPayload & JwtPayload {
  return jwt.verify(token, REFRESH_SECRET) as RefreshTokenPayload & JwtPayload;
}

export function decodeToken(token: string): (RefreshTokenPayload & JwtPayload) | null {
  try {
    return jwt.decode(token) as (RefreshTokenPayload & JwtPayload) | null;
  } catch {
    return null;
  }
}
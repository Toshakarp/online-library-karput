import type { Request, Response, NextFunction } from 'express';
import { jwtUtil } from '@/utils/jwt.util.js';
import { UnauthorizedError } from '@/errors/app.errors.js';

export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const [scheme, token] = req.headers.authorization?.split(' ') ?? [];

  if (scheme !== 'Bearer' || !token) {
    return next(new UnauthorizedError('Missing or invalid token'));
  }

  try {
    const decoded = jwtUtil.verify(token);
    req.user = { id: decoded.userId };
    return next();
  } catch {
    return next(new UnauthorizedError('Invalid or expired token'));
  }
};

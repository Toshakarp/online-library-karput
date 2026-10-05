import type { Request, Response, NextFunction } from 'express';
import { jwtUtil } from '@/utils/jwt.util.js';

export const optionalAuthMiddleware = (req: Request, res: Response, next: NextFunction) => {
  req.user = undefined;

  const [scheme, token] = req.headers.authorization?.split(' ') ?? [];

  if (scheme === 'Bearer' && token) {
    try {
      const decoded = jwtUtil.verify(token);
      req.user = { id: decoded.userId };
    } catch {}
  }

  next();
};

import jwt from 'jsonwebtoken';
import { env } from '@/config/env.config.js';

export const jwtUtil = {
  sign(payload: { userId: string }): string {
    return jwt.sign(payload, env.JWT_SECRET, { expiresIn: env.JWT_EXPIRES_IN } as any);
  },

  verify(token: string): { userId: string } {
    return jwt.verify(token, env.JWT_SECRET) as { userId: string };
  }
};
import type { Request, Response, NextFunction } from 'express';
import { DomainError } from '@/errors/app.errors.js';
import type { ApiResponse } from 'shared-types';

export const errorMiddleware = (err: Error, req: Request, res: Response<ApiResponse<null>>, next: NextFunction) => {
  console.error(err);

  if (err instanceof DomainError) {
    res.status(err.statusCode).json({
      success: false,
      error: {
        code: err.code,
        message: err.message
      }
    });
    return;
  }

  if ((err as any).code === '23505') {
    res.status(409).json({
      success: false,
      error: {
        code: 'CONFLICT',
        message: 'Resource already exists'
      }
    });
    return;
  }

  res.status(500).json({
    success: false,
    error: {
      code: 'INTERNAL_SERVER_ERROR',
      message: 'An unexpected error occurred'
    }
  });
};
import type { Request, Response, NextFunction } from 'express';
import { userBookService } from '@/services/userBook.service.js';

export const userBookController = {
  async setLike(req: Request, res: Response, next: NextFunction) {
    try {
      await userBookService.setLike(req.user!.id, req.body);
      res.json({ success: true, data: null });
    } catch (error) {
      next(error);
    }
  },
  async setStatus(req: Request, res: Response, next: NextFunction) {
    try {
      await userBookService.setStatus(req.user!.id, req.body);
      res.json({ success: true, data: null });
    } catch (error) {
      next(error);
    }
  },
  async getUserBooks(req: Request, res: Response, next: NextFunction) {
    try {
      const data = await userBookService.getUserBooks(req.user!.id, req.query as any);
      res.json({ success: true, data });
    } catch (error) {
      next(error);
    }
  },
};

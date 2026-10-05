import type { Request, Response, NextFunction } from 'express';
import { profileService } from '@/services/profile.service.js';

export const profileController = {
  async getMe(req: Request, res: Response, next: NextFunction) {
    try {
      const data = await profileService.getMe(req.user!.id);
      res.json({ success: true, data });
    } catch (error) {
      next(error);
    }
  },
  async updateMe(req: Request, res: Response, next: NextFunction) {
    try {
      const data = await profileService.updateProfile(req.user!.id, req.body);
      res.json({ success: true, data });
    } catch (error) {
      next(error);
    }
  },
  async updateUsername(req: Request, res: Response, next: NextFunction) {
    try {
      const data = await profileService.updateUsername(req.user!.id, req.body);
      res.json({ success: true, data });
    } catch (error) {
      next(error);
    }
  },
  async uploadAvatar(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.file) throw new Error('No file provided');
      const data = await profileService.uploadAvatar(req.user!.id, req.file);
      res.json({ success: true, data });
    } catch (error) {
      next(error);
    }
  },
};

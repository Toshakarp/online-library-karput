import type { Request, Response, NextFunction } from 'express';
import { commentService } from '@/services/comment.service.js';

export const commentController = {
    async getByBook(req: Request, res: Response, next: NextFunction) {
        try {
            const olid = typeof req.params.olid === 'string' ? req.params.olid : '';
            const page = Number(req.query.page) || 1;
            const limit = Number(req.query.limit) || 10;

            const data = await commentService.getByBook(olid, page, limit);
            res.json({ success: true, data });
        } catch (error) { next(error); }
    },

    async getByUser(req: Request, res: Response, next: NextFunction) {
        try {
            const page = Number(req.query.page) || 1;
            const limit = Number(req.query.limit) || 10;

            const data = await commentService.getByUser(req.user!.id, page, limit);
            res.json({ success: true, data });
        } catch (error) { next(error); }
    },

    async create(req: Request, res: Response, next: NextFunction) {
        try {
            const data = await commentService.addComment(req.user!.id, req.body);
            res.status(201).json({ success: true, data });
        } catch (error) { next(error); }
    },

    async update(req: Request, res: Response, next: NextFunction) {
        try {
            const commentId = typeof req.params.id === 'string' ? req.params.id : '';

            const data = await commentService.updateComment(req.user!.id, commentId, req.body);
            res.json({ success: true, data });
        } catch (error) { next(error); }
    },

    async delete(req: Request, res: Response, next: NextFunction) {
        try {
            const commentId = typeof req.params.id === 'string' ? req.params.id : '';

            await commentService.deleteComment(req.user!.id, commentId);
            res.json({ success: true, data: null });
        } catch (error) { next(error); }
    }
};
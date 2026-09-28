import type { Request, Response, NextFunction } from 'express';
import { bookService } from '@/services/book.service.js';

export const bookController = {
    async search(req: Request, res: Response, next: NextFunction) {
        try {
            const q = typeof req.query.q === 'string' ? req.query.q : '';
            const page = Number(req.query.page) || 1;
            const limit = Number(req.query.limit) || 10;

            const data = await bookService.searchBooks(q, req.user?.id, page, limit);

            res.json({ success: true, data });
        } catch (error) { next(error); }
    },

    async getByOlid(req: Request, res: Response, next: NextFunction) {
        try {
            const olid = typeof req.params.olid === 'string' ? req.params.olid : '';

            const data = await bookService.getBookByOlid(olid, req.user?.id);

            res.json({ success: true, data });
        } catch (error) { next(error); }
    }
};
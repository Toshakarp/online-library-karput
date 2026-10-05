import { Router } from 'express';
import { userBookController } from '@/controllers/userBook.controller.js';
import { authMiddleware } from '@/middlewares/auth.middleware.js';
import { validate } from '@/middlewares/validate.middleware.js';
import { z } from 'zod';

const router = Router();

const setLikeSchema = z.object({
  bookOlid: z.string(),
  liked: z.boolean(),
  title: z.string(),
  authorName: z.string(),
  coverUrl: z.string().nullable().optional(),
});

const setStatusSchema = z.object({
  bookOlid: z.string(),
  status: z.enum(['WANT_TO_READ', 'READING', 'COMPLETED']).nullable(),
  title: z.string(),
  authorName: z.string(),
  coverUrl: z.string().nullable().optional(),
});

const getUserBooksSchema = z.object({
  q: z.string().optional(),
  category: z.enum(['liked', 'reading_list', 'all']).optional(),
  status: z.enum(['WANT_TO_READ', 'READING', 'COMPLETED']).optional(),
  sort: z.enum(['alpha_asc', 'alpha_desc']).optional(),
  page: z
    .union([z.string().regex(/^\d+$/).transform(Number), z.number()])
    .optional()
    .default(1),
  limit: z
    .union([z.string().regex(/^\d+$/).transform(Number), z.number()])
    .optional()
    .default(10),
});

router.use(authMiddleware);
router.post('/like', validate(setLikeSchema, 'body'), userBookController.setLike);
router.post('/status', validate(setStatusSchema, 'body'), userBookController.setStatus);
router.get('/', validate(getUserBooksSchema, 'query'), userBookController.getUserBooks);

export default router;

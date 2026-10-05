import { Router } from 'express';
import { bookController } from '@/controllers/book.controller.js';
import { optionalAuthMiddleware } from '@/middlewares/optionalAuth.middleware.js';
import { validate } from '@/middlewares/validate.middleware.js';
import { z } from 'zod';

const router = Router();

const searchSchema = z.object({
  q: z.string().min(1),
  page: z
    .union([z.string().regex(/^\d+$/).transform(Number), z.number()])
    .optional()
    .default(1),
  limit: z
    .union([z.string().regex(/^\d+$/).transform(Number), z.number()])
    .optional()
    .default(10),
});

router.get(
  '/search',
  optionalAuthMiddleware,
  validate(searchSchema, 'query'),
  bookController.search,
);
router.get('/:olid', optionalAuthMiddleware, bookController.getByOlid);

export default router;

import { Router } from 'express';
import { commentController } from '@/controllers/comment.controller.js';
import { authMiddleware } from '@/middlewares/auth.middleware.js';
import { validate } from '@/middlewares/validate.middleware.js';
import { z } from 'zod';

const router = Router();

const createSchema = z.object({
    bookOlid: z.string(),
    content: z.string().min(1),
    title: z.string(),
    authorName: z.string(),
    coverUrl: z.string().optional()
});

const updateSchema = z.object({
    content: z.string().min(1)
});

router.get('/book/:olid', commentController.getByBook);
router.use(authMiddleware);
router.get('/user', commentController.getByUser);
router.post('/', validate(createSchema, 'body'), commentController.create);
router.patch('/:id', validate(updateSchema, 'body'), commentController.update);
router.delete('/:id', commentController.delete);

export default router;
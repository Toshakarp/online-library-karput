import { Router } from 'express';
import { authController } from '@/controllers/auth.controller.js';
import { validate } from '@/middlewares/validate.middleware.js';
import { authMiddleware } from '@/middlewares/auth.middleware.js';
import { z } from 'zod';

const router = Router();

const registerSchema = z.object({
  username: z.string().min(3),
  password: z.string().min(6),
});

const changePasswordSchema = z.object({
  currentPassword: z.string().min(1),
  newPassword: z.string().min(6),
});

router.post('/register', validate(registerSchema, 'body'), authController.register);

router.post('/login', validate(registerSchema, 'body'), authController.login);

router.patch(
  '/change-password',
  authMiddleware,
  validate(changePasswordSchema, 'body'),
  authController.changePassword,
);

export default router;

import { Router } from 'express';
import multer from 'multer';
import { profileController } from '@/controllers/profile.controller.js';
import { authMiddleware } from '@/middlewares/auth.middleware.js';
import { validate } from '@/middlewares/validate.middleware.js';
import { z } from 'zod';

const router = Router();
const upload = multer({ storage: multer.memoryStorage() });

const updateProfileSchema = z.object({
    displayName: z.string().optional(),
    avatarUrl: z.string().nullable().optional()
});

const updateUsernameSchema = z.object({
    newUsername: z.string().min(3)
});

router.use(authMiddleware);

router.get('/me', profileController.getMe);

router.patch('/me', validate(updateProfileSchema, 'body'), profileController.updateMe);

router.patch('/me/username', validate(updateUsernameSchema, 'body'), profileController.updateUsername);

router.post('/me/avatar', upload.single('avatar'), profileController.uploadAvatar);

export default router;
import { Router } from 'express';
import authRoutes from './auth.routes.js';
import profileRoutes from './profile.routes.js';
import bookRoutes from './book.routes.js';
import userBookRoutes from './userBook.routes.js';
import commentRoutes from './comment.routes.js';

const router = Router();

router.use('/auth', authRoutes);
router.use('/profile', profileRoutes);
router.use('/books', bookRoutes);
router.use('/user-books', userBookRoutes);
router.use('/comments', commentRoutes);

export default router;
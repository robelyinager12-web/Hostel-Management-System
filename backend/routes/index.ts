import { Router } from 'express';
import authRoutes from './authRoutes';
import roomRoutes from './roomRoutes';

const router = Router();

router.use('/auth', authRoutes);
router.use('/rooms', roomRoutes);

export default router;
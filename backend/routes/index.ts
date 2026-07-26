import { Router } from 'express';
import authRoutes from './authRoutes';
import roomRoutes from './roomRoutes';
import studentRoutes from './studentRoutes';
import feeRoutes from './feeRoutes';

const router = Router();

router.use('/auth', authRoutes);
router.use('/rooms', roomRoutes);
router.use('/students', studentRoutes);
router.use('/fees', feeRoutes);

export default router;
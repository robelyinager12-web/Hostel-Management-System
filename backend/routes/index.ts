import { Router } from 'express';
import authRoutes from './authRoutes';
import roomRoutes from './roomRoutes';
import studentRoutes from './studentRoutes';
import feeRoutes from './feeRoutes';
import complaintRoutes from './complaintRoutes';

const router = Router();

router.use('/auth', authRoutes);
router.use('/rooms', roomRoutes);
router.use('/students', studentRoutes);
router.use('/fees', feeRoutes);
router.use('/complaints', complaintRoutes);

export default router;
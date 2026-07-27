import { Router } from 'express';
import authRoutes from './authRoutes';
import roomRoutes from './roomRoutes';
import studentRoutes from './studentRoutes';
import feeRoutes from './feeRoutes';
import complaintRoutes from './complaintRoutes';
import announcementRoutes from './announcementRoutes';
import visitorRoutes from './visitorRoutes';

const router = Router();

router.use('/auth', authRoutes);
router.use('/rooms', roomRoutes);
router.use('/students', studentRoutes);
router.use('/fees', feeRoutes);
router.use('/complaints', complaintRoutes);
router.use('/announcements', announcementRoutes);
router.use('/visitors', visitorRoutes);

export default router;
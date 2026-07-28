import { Router } from 'express';
import authRoutes from './authRoutes';
import roomRoutes from './roomRoutes';
import studentRoutes from './studentRoutes';
import feeRoutes from './feeRoutes';
import complaintRoutes from './complaintRoutes';
import announcementRoutes from './announcementRoutes';
import visitorRoutes from './visitorRoutes';
import aiRoutes from './aiRoutes';
import maintenanceRoutes from './maintenanceRoutes';
import attendanceRoutes from './attendanceRoutes';

const router = Router();

router.use('/auth', authRoutes);
router.use('/rooms', roomRoutes);
router.use('/students', studentRoutes);
router.use('/fees', feeRoutes);
router.use('/complaints', complaintRoutes);
router.use('/announcements', announcementRoutes);
router.use('/visitors', visitorRoutes);
router.use('/ai', aiRoutes);
router.use('/maintenance', maintenanceRoutes);
router.use('/attendance', attendanceRoutes);

export default router;
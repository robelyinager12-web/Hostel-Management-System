import { Router } from 'express';
import * as studentController from '../controllers/studentController';
import { authMiddleware } from '../middleware/authMiddleware';
import { requireRole } from '../middleware/roleMiddleware';

const router = Router();

router.get('/me/profile', authMiddleware, studentController.getMyProfile);
router.get('/me/room', authMiddleware, studentController.getMyRoom);

router.get(
  '/',
  authMiddleware,
  requireRole('ADMINISTRATOR', 'HOSTEL_MANAGER', 'WARDEN', 'RECEPTIONIST'),
  studentController.getAllStudents,
);

export default router;
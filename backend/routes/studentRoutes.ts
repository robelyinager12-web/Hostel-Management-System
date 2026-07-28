import { Router } from 'express';
import * as studentController from '../controllers/studentController';
import { authMiddleware } from '../middleware/authMiddleware';
import { requireRole } from '../middleware/roleMiddleware';

const router = Router();

const MANAGE_STUDENTS = ['ADMINISTRATOR', 'HOSTEL_MANAGER', 'WARDEN', 'RECEPTIONIST'];

router.get('/me/profile', authMiddleware, studentController.getMyProfile);
router.get('/me/room', authMiddleware, studentController.getMyRoom);

router.get('/', authMiddleware, requireRole(...MANAGE_STUDENTS), studentController.getAllStudents);
router.post(
  '/',
  authMiddleware,
  requireRole('ADMINISTRATOR', 'HOSTEL_MANAGER'),
  studentController.createStudent,
);

export default router;
import { Router } from 'express';
import * as attendanceController from '../controllers/attendanceController';
import { authMiddleware } from '../middleware/authMiddleware';
import { requireRole } from '../middleware/roleMiddleware';

const router = Router();

const MANAGE_ATTENDANCE = ['ADMINISTRATOR', 'HOSTEL_MANAGER', 'WARDEN'];

router.get('/me', authMiddleware, attendanceController.getMyAttendance);
router.get(
  '/',
  authMiddleware,
  requireRole(...MANAGE_ATTENDANCE),
  attendanceController.getAttendanceByDate,
);
router.post(
  '/',
  authMiddleware,
  requireRole(...MANAGE_ATTENDANCE),
  attendanceController.markAttendance,
);

export default router;
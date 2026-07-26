import { Router } from 'express';
import * as complaintController from '../controllers/complaintController';
import { authMiddleware } from '../middleware/authMiddleware';
import { requireRole } from '../middleware/roleMiddleware';

const router = Router();

const MANAGE_COMPLAINTS = ['ADMINISTRATOR', 'HOSTEL_MANAGER', 'WARDEN'];

router.post('/', authMiddleware, complaintController.createComplaint);
router.get('/me', authMiddleware, complaintController.getMyComplaints);

router.get(
  '/',
  authMiddleware,
  requireRole(...MANAGE_COMPLAINTS),
  complaintController.getAllComplaints,
);
router.patch(
  '/:id/status',
  authMiddleware,
  requireRole(...MANAGE_COMPLAINTS),
  complaintController.updateComplaintStatus,
);

export default router;
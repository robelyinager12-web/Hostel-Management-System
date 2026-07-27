import { Router } from 'express';
import * as visitorController from '../controllers/visitorController';
import { authMiddleware } from '../middleware/authMiddleware';
import { requireRole } from '../middleware/roleMiddleware';

const router = Router();

const MANAGE_VISITORS = ['ADMINISTRATOR', 'HOSTEL_MANAGER', 'RECEPTIONIST', 'SECURITY_GUARD'];

router.get('/', authMiddleware, requireRole(...MANAGE_VISITORS), visitorController.getAllVisitors);
router.post('/', authMiddleware, requireRole(...MANAGE_VISITORS), visitorController.checkInVisitor);
router.patch(
  '/:id/check-out',
  authMiddleware,
  requireRole(...MANAGE_VISITORS),
  visitorController.checkOutVisitor,
);

export default router;
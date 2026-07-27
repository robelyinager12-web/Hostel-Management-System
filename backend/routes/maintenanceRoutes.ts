import { Router } from 'express';
import * as maintenanceController from '../controllers/maintenanceController';
import { authMiddleware } from '../middleware/authMiddleware';
import { requireRole } from '../middleware/roleMiddleware';

const router = Router();

const MANAGE_MAINTENANCE = ['ADMINISTRATOR', 'HOSTEL_MANAGER', 'WARDEN', 'MAINTENANCE_STAFF'];

router.get(
  '/',
  authMiddleware,
  requireRole(...MANAGE_MAINTENANCE),
  maintenanceController.getAllMaintenanceRequests,
);
router.post(
  '/',
  authMiddleware,
  requireRole(...MANAGE_MAINTENANCE),
  maintenanceController.createMaintenanceRequest,
);
router.patch(
  '/:id/status',
  authMiddleware,
  requireRole('ADMINISTRATOR', 'HOSTEL_MANAGER', 'WARDEN', 'MAINTENANCE_STAFF'),
  maintenanceController.updateMaintenanceStatus,
);

export default router;
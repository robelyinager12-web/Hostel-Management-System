import { Router } from 'express';
import * as announcementController from '../controllers/announcementController';
import { authMiddleware } from '../middleware/authMiddleware';
import { requireRole } from '../middleware/roleMiddleware';

const router = Router();

const MANAGE_ANNOUNCEMENTS = ['ADMINISTRATOR', 'HOSTEL_MANAGER', 'WARDEN'];

router.get('/', authMiddleware, announcementController.getAnnouncements);

router.post(
  '/',
  authMiddleware,
  requireRole(...MANAGE_ANNOUNCEMENTS),
  announcementController.createAnnouncement,
);
router.delete(
  '/:id',
  authMiddleware,
  requireRole(...MANAGE_ANNOUNCEMENTS),
  announcementController.deleteAnnouncement,
);

export default router;
import { Router } from 'express';
import * as roomController from '../controllers/roomController';
import { authMiddleware } from '../middleware/authMiddleware';
import { requireRole } from '../middleware/roleMiddleware';

const router = Router();

const MANAGE_ROOMS = ['ADMINISTRATOR', 'HOSTEL_MANAGER', 'WARDEN'];

router.get('/', authMiddleware, roomController.getRooms);
router.get('/stats', authMiddleware, requireRole(...MANAGE_ROOMS), roomController.getRoomStats);
router.get('/:id', authMiddleware, roomController.getRoomById);

router.post('/', authMiddleware, requireRole(...MANAGE_ROOMS), roomController.createRoom);
router.patch('/:id', authMiddleware, requireRole(...MANAGE_ROOMS), roomController.updateRoom);
router.delete('/:id', authMiddleware, requireRole(...MANAGE_ROOMS), roomController.deleteRoom);

export default router;
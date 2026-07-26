import { Router } from 'express';
import * as feeController from '../controllers/feeController';
import { authMiddleware } from '../middleware/authMiddleware';
import { requireRole } from '../middleware/roleMiddleware';

const router = Router();

const MANAGE_FEES = ['ADMINISTRATOR', 'ACCOUNTANT'];

router.get('/me', authMiddleware, feeController.getMyFees);

router.get('/', authMiddleware, requireRole(...MANAGE_FEES), feeController.getAllFees);
router.post('/', authMiddleware, requireRole(...MANAGE_FEES), feeController.createFee);
router.patch(
  '/:id/mark-paid',
  authMiddleware,
  requireRole(...MANAGE_FEES),
  feeController.markFeePaid,
);

export default router;
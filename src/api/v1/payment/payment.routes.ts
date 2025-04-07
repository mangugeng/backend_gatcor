import express from 'express';
import {
  createPayment,
  getPaymentById,
  processPayment,
  refundPayment,
  getPaymentHistory,
  checkPaymentStatus
} from '../../../controllers/payment/payment.controller';
import { authenticateUser } from '../../../middleware/auth.middleware';
import {
  validatePaymentAccess,
  validatePaymentStatus,
  validatePaymentProvider
} from '../../../middleware/payment.middleware';

const router = express.Router();

// Apply authentication middleware to all routes
router.use(authenticateUser);

// Payment routes
router.post('/', createPayment);
router.get('/:id', validatePaymentAccess, getPaymentById);
router.post(
  '/:id/process',
  validatePaymentAccess,
  validatePaymentStatus(['pending']),
  processPayment
);
router.post(
  '/:id/refund',
  validatePaymentAccess,
  validatePaymentStatus(['completed']),
  refundPayment
);
router.get('/history', getPaymentHistory);
router.get('/:id/status', validatePaymentAccess, checkPaymentStatus);

export default router; 
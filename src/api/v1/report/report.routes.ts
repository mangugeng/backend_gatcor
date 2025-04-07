import { Router } from 'express';
import { authenticate } from '../../middleware/auth.middleware';
import {
  getOrderReport,
  getPaymentReport,
  getDriverReport,
  getCustomerReport,
  getPromotionReport,
  getRatingReport,
  getAnalyticsReport
} from '../../../controllers/report/report.controller';

const router = Router();

// Semua endpoint laporan memerlukan autentikasi
router.use(authenticate);

// Laporan Order
router.get('/orders', getOrderReport);

// Laporan Pembayaran
router.get('/payments', getPaymentReport);

// Laporan Driver
router.get('/drivers', getDriverReport);

// Laporan Customer
router.get('/customers', getCustomerReport);

// Laporan Promosi
router.get('/promotions', getPromotionReport);

// Laporan Rating
router.get('/ratings', getRatingReport);

// Laporan Analitik
router.get('/analytics', getAnalyticsReport);

export default router; 
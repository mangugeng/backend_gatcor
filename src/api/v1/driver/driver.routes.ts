import express from 'express';
import {
  getDrivers,
  getDriverById,
  updateDriver,
  deleteDriver,
  getDriverOrders,
  getDriverRatings,
  getDriverEarnings,
  updateDriverStatus,
  updateDriverLocation
} from '../../../controllers/driver/driver.controller';
import { authenticateUser } from '../../../middleware/auth.middleware';

const router = express.Router();

// Semua route membutuhkan autentikasi
router.use(authenticateUser);

// Routes untuk driver
router.get('/', getDrivers);
router.get('/:id', getDriverById);
router.put('/:id', updateDriver);
router.delete('/:id', deleteDriver);
router.get('/:id/orders', getDriverOrders);
router.get('/:id/ratings', getDriverRatings);
router.get('/:id/earnings', getDriverEarnings);
router.put('/:id/status', updateDriverStatus);
router.put('/:id/location', updateDriverLocation);

export default router; 
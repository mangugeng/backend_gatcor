import express from 'express';
import * as orderController from '../../../controllers/order/order.controller';
import { authenticateUser } from '../../../middleware/auth.middleware';

const router = express.Router();

// Semua route membutuhkan autentikasi
router.use(authenticateUser);

// Routes untuk order
router.post('/', orderController.createOrder);
router.get('/', orderController.getOrders);
router.get('/:id', orderController.getOrderById);
router.put('/:id', orderController.updateOrder);
router.put('/:id/status', orderController.updateOrderStatus);
router.get('/:id/tracking', orderController.trackOrder);
router.post('/:id/cancel', orderController.cancelOrder);
router.post('/:id/rate', orderController.rateOrder);

export default router; 
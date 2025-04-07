import express from 'express';
import * as customerController from '../../../controllers/customer/customer.controller';
import { authenticateUser } from '../../../middleware/auth.middleware';

const router = express.Router();

// Semua route membutuhkan autentikasi
router.use(authenticateUser);

// Routes untuk customer
router.get('/', customerController.getCustomers);
router.get('/:id', customerController.getCustomerById);
router.put('/:id', customerController.updateCustomer);
router.delete('/:id', customerController.deleteCustomer);
router.get('/:id/orders', customerController.getCustomerOrders);
router.get('/:id/ratings', customerController.getCustomerRatings);
router.get('/:id/payments', customerController.getCustomerPayments);

export default router; 
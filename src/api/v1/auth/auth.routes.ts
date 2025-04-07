import express from 'express';
import {
  registerCustomer,
  loginCustomer,
  verifyCustomerEmail,
  forgotCustomerPassword,
  resetCustomerPassword,
  refreshCustomerToken,
  logoutCustomer,
  registerDriver,
  loginDriver,
  verifyDriverEmail,
  forgotDriverPassword,
  resetDriverPassword,
  refreshDriverToken,
  logoutDriver,
  loginAdmin,
  forgotAdminPassword,
  resetAdminPassword,
  refreshAdminToken,
  logoutAdmin,
  createFirstAdmin
} from '../../../controllers/auth/auth.controller';
import { login } from '../../../controllers/auth/login.controller';

const router = express.Router();

// Customer Auth Routes
router.post('/customer/register', registerCustomer);
router.post('/customer/login', loginCustomer);
router.post('/customer/verify-email', verifyCustomerEmail);
router.post('/customer/forgot-password', forgotCustomerPassword);
router.post('/customer/reset-password', resetCustomerPassword);
router.post('/customer/refresh-token', refreshCustomerToken);
router.post('/customer/logout', logoutCustomer);

// Driver Auth Routes
router.post('/driver/register', registerDriver);
router.post('/driver/login', loginDriver);
router.post('/driver/verify-email', verifyDriverEmail);
router.post('/driver/forgot-password', forgotDriverPassword);
router.post('/driver/reset-password', resetDriverPassword);
router.post('/driver/refresh-token', refreshDriverToken);
router.post('/driver/logout', logoutDriver);

// Admin Auth Routes
router.post('/admin/create-first', createFirstAdmin);
router.post('/admin/login', loginAdmin);
router.post('/admin/forgot-password', forgotAdminPassword);
router.post('/admin/reset-password', resetAdminPassword);
router.post('/admin/refresh-token', refreshAdminToken);
router.post('/admin/logout', logoutAdmin);

router.post('/login', login);

export default router; 
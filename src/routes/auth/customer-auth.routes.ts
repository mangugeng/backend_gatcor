import { Router } from 'express';
import { CustomerAuthController } from '../../controllers/auth/customer-auth.controller';

const router = Router();
const customerAuthController = new CustomerAuthController();

// Endpoint untuk verifikasi email
router.post('/verify-email', customerAuthController.verifyEmail);

// Endpoint untuk forgot password
router.post('/forgot-password', customerAuthController.forgotPassword);

// Endpoint untuk reset password
router.post('/reset-password', customerAuthController.resetPassword);

// Endpoint untuk refresh token
router.post('/refresh-token', customerAuthController.refreshToken);

export default router; 
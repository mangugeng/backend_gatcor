import { Router } from 'express';
import { DriverAuthController } from '../../controllers/auth/driver-auth.controller';

const router = Router();
const driverAuthController = new DriverAuthController();

// Endpoint untuk verifikasi email
router.post('/verify-email', driverAuthController.verifyEmail);

// Endpoint untuk forgot password
router.post('/forgot-password', driverAuthController.forgotPassword);

// Endpoint untuk reset password
router.post('/reset-password', driverAuthController.resetPassword);

// Endpoint untuk refresh token
router.post('/refresh-token', driverAuthController.refreshToken);

export default router; 
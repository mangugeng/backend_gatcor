import { Router } from 'express';
import { AdminAuthController } from '../../controllers/auth/admin-auth.controller';

const router = Router();
const adminAuthController = new AdminAuthController();

// Endpoint untuk verifikasi email
router.post('/verify-email', adminAuthController.verifyEmail);

// Endpoint untuk forgot password
router.post('/forgot-password', adminAuthController.forgotPassword);

// Endpoint untuk reset password
router.post('/reset-password', adminAuthController.resetPassword);

// Endpoint untuk refresh token
router.post('/refresh-token', adminAuthController.refreshToken);

export default router; 
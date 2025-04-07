import { Admin } from '../../models/admin.model';
import { generateToken, verifyToken } from '../../utils/jwt.utils';
import { sendEmail } from '../../utils/email.utils';
import { config } from '../../config/config';

export class AdminAuthService {
  async verifyEmail(token: string) {
    try {
      const decoded = verifyToken(token);
      const admin = await Admin.findOne({ where: { id: decoded.id } });

      if (!admin) {
        return { success: false, message: 'Admin tidak ditemukan' };
      }

      if (admin.isEmailVerified) {
        return { success: false, message: 'Email sudah terverifikasi' };
      }

      admin.isEmailVerified = true;
      await admin.save();

      return { success: true, message: 'Email berhasil diverifikasi' };
    } catch (error) {
      return { success: false, message: 'Token tidak valid atau sudah kadaluarsa' };
    }
  }

  async forgotPassword(email: string) {
    try {
      const admin = await Admin.findOne({ where: { email } });

      if (!admin) {
        return { success: false, message: 'Admin tidak ditemukan' };
      }

      const resetToken = generateToken({ id: admin.id }, '1h');
      const resetUrl = `${config.frontendUrl}/reset-password?token=${resetToken}`;

      await sendEmail({
        to: email,
        subject: 'Reset Password - Admin Gatcor',
        html: `
          <h1>Reset Password</h1>
          <p>Klik link di bawah ini untuk mereset password Anda:</p>
          <a href="${resetUrl}">${resetUrl}</a>
          <p>Link ini akan kadaluarsa dalam 1 jam.</p>
        `
      });

      return { success: true, message: 'Email reset password telah dikirim' };
    } catch (error) {
      return { success: false, message: 'Gagal mengirim email reset password' };
    }
  }

  async resetPassword(token: string, newPassword: string) {
    try {
      const decoded = verifyToken(token);
      const admin = await Admin.findOne({ where: { id: decoded.id } });

      if (!admin) {
        return { success: false, message: 'Admin tidak ditemukan' };
      }

      admin.password = newPassword;
      await admin.save();

      return { success: true, message: 'Password berhasil direset' };
    } catch (error) {
      return { success: false, message: 'Token tidak valid atau sudah kadaluarsa' };
    }
  }

  async refreshToken(refreshToken: string) {
    try {
      const decoded = verifyToken(refreshToken);
      const admin = await Admin.findOne({ where: { id: decoded.id } });

      if (!admin) {
        return { success: false, message: 'Admin tidak ditemukan' };
      }

      const accessToken = generateToken({ id: admin.id, role: 'admin' });
      const newRefreshToken = generateToken({ id: admin.id }, '7d');

      return {
        success: true,
        data: {
          accessToken,
          refreshToken: newRefreshToken
        }
      };
    } catch (error) {
      return { success: false, message: 'Token tidak valid atau sudah kadaluarsa' };
    }
  }
} 
import { Request, Response } from 'express';
import { AdminAuthService } from '../../services/auth/admin-auth.service';

export class AdminAuthController {
  private adminAuthService: AdminAuthService;

  constructor() {
    this.adminAuthService = new AdminAuthService();
  }

  async verifyEmail(req: Request, res: Response) {
    try {
      const { token } = req.body;
      const result = await this.adminAuthService.verifyEmail(token);

      if (!result.success) {
        return res.status(400).json(result);
      }

      return res.json(result);
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: 'Terjadi kesalahan saat memverifikasi email'
      });
    }
  }

  async forgotPassword(req: Request, res: Response) {
    try {
      const { email } = req.body;
      const result = await this.adminAuthService.forgotPassword(email);

      if (!result.success) {
        return res.status(400).json(result);
      }

      return res.json(result);
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: 'Terjadi kesalahan saat memproses forgot password'
      });
    }
  }

  async resetPassword(req: Request, res: Response) {
    try {
      const { token, newPassword } = req.body;
      const result = await this.adminAuthService.resetPassword(token, newPassword);

      if (!result.success) {
        return res.status(400).json(result);
      }

      return res.json(result);
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: 'Terjadi kesalahan saat mereset password'
      });
    }
  }

  async refreshToken(req: Request, res: Response) {
    try {
      const { refreshToken } = req.body;
      const result = await this.adminAuthService.refreshToken(refreshToken);

      if (!result.success) {
        return res.status(400).json(result);
      }

      return res.json(result);
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: 'Terjadi kesalahan saat merefresh token'
      });
    }
  }
} 
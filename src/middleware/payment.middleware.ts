import { Request, Response, NextFunction } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const validatePaymentAccess = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const payment = await prisma.payment.findUnique({
      where: { id },
      include: {
        order: {
          select: {
            customerId: true,
            driverId: true
          }
        }
      }
    });

    if (!payment) {
      return res.status(404).json({
        success: false,
        message: 'Pembayaran tidak ditemukan'
      });
    }

    if (req.user.role !== 'admin' && 
        req.user.id !== payment.order.customerId && 
        req.user.id !== payment.order.driverId) {
      return res.status(403).json({
        success: false,
        message: 'Anda tidak memiliki akses ke pembayaran ini'
      });
    }

    req.payment = payment;
    next();
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Terjadi kesalahan saat memvalidasi akses pembayaran',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

export const validatePaymentStatus = (allowedStatuses: string[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const payment = await prisma.payment.findUnique({
        where: { id }
      });

      if (!payment) {
        return res.status(404).json({
          success: false,
          message: 'Pembayaran tidak ditemukan'
        });
      }

      if (!allowedStatuses.includes(payment.status)) {
        return res.status(400).json({
          success: false,
          message: `Pembayaran harus dalam status: ${allowedStatuses.join(', ')}`
        });
      }

      req.payment = payment;
      next();
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Terjadi kesalahan saat memvalidasi status pembayaran',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  };
};

export const validatePaymentProvider = (allowedProviders: string[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const payment = await prisma.payment.findUnique({
        where: { id }
      });

      if (!payment) {
        return res.status(404).json({
          success: false,
          message: 'Pembayaran tidak ditemukan'
        });
      }

      if (!allowedProviders.includes(payment.provider)) {
        return res.status(400).json({
          success: false,
          message: `Pembayaran harus menggunakan provider: ${allowedProviders.join(', ')}`
        });
      }

      req.payment = payment;
      next();
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Terjadi kesalahan saat memvalidasi provider pembayaran',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  };
}; 
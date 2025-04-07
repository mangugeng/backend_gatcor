import { Request, Response } from 'express';
import { PaymentService } from '../../services/payment.service';
import { createPaymentSchema, processPaymentSchema, refundPaymentSchema } from '../../utils/validators/payment.validator';

const paymentService = new PaymentService();

export const createPayment = async (req: Request, res: Response) => {
  try {
    const { orderId, amount, paymentMethod, customerId } = req.body;

    const payment = await paymentService.createPayment({
      orderId,
      amount,
      paymentMethod,
      customerId
    });

    return res.status(201).json({
      success: true,
      message: 'Pembayaran berhasil dibuat',
      data: payment
    });
  } catch (error) {
    console.error('Error in createPayment controller:', error);
    return res.status(500).json({
      success: false,
      message: 'Terjadi kesalahan saat membuat pembayaran',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

export const getAllPayments = async (req: Request, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;

    const result = await paymentService.getAllPayments(page, limit);

    return res.status(200).json({
      success: true,
      message: 'Berhasil mendapatkan daftar pembayaran',
      data: result.data,
      meta: result.meta
    });
  } catch (error) {
    console.error('Error in getAllPayments controller:', error);
    return res.status(500).json({
      success: false,
      message: 'Terjadi kesalahan saat mendapatkan daftar pembayaran',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

export const getPaymentById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const payment = await paymentService.getPaymentById(id);

    return res.status(200).json({
      success: true,
      message: 'Berhasil mendapatkan detail pembayaran',
      data: payment
    });
  } catch (error) {
    console.error('Error in getPaymentById controller:', error);
    if (error instanceof Error && error.message === 'Payment not found') {
      return res.status(404).json({
        success: false,
        message: 'Pembayaran tidak ditemukan'
      });
    }
    return res.status(500).json({
      success: false,
      message: 'Terjadi kesalahan saat mendapatkan detail pembayaran',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

export const updatePayment = async (req: Request, res: Response) => {
  try {
    return res.status(200).json({
      success: true,
      message: 'Pembayaran berhasil diperbarui',
      data: { id: req.params.id, ...req.body }
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Terjadi kesalahan server'
    });
  }
};

export const deletePayment = async (req: Request, res: Response) => {
  try {
    return res.status(200).json({
      success: true,
      message: 'Pembayaran berhasil dihapus',
      data: { id: req.params.id }
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Terjadi kesalahan server'
    });
  }
};

export const processPayment = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const payment = await paymentService.processPayment(id);

    return res.status(200).json({
      success: true,
      message: 'Pembayaran berhasil diproses',
      data: payment
    });
  } catch (error) {
    console.error('Error in processPayment controller:', error);
    if (error instanceof Error && error.message === 'Payment not found') {
      return res.status(404).json({
        success: false,
        message: 'Pembayaran tidak ditemukan'
      });
    }
    return res.status(500).json({
      success: false,
      message: 'Terjadi kesalahan saat memproses pembayaran',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

export const refundPayment = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { reason } = req.body;

    const payment = await paymentService.refundPayment(id, reason);

    return res.status(200).json({
      success: true,
      message: 'Pembayaran berhasil direfund',
      data: payment
    });
  } catch (error) {
    console.error('Error in refundPayment controller:', error);
    if (error instanceof Error) {
      if (error.message === 'Payment not found') {
        return res.status(404).json({
          success: false,
          message: 'Pembayaran tidak ditemukan'
        });
      }
      if (error.message === 'Only settled payments can be refunded') {
        return res.status(400).json({
          success: false,
          message: 'Hanya pembayaran yang sudah diselesaikan yang dapat direfund'
        });
      }
    }
    return res.status(500).json({
      success: false,
      message: 'Terjadi kesalahan saat merefund pembayaran',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

export const getPaymentHistory = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const result = await paymentService.getPaymentHistory(id);

    return res.status(200).json({
      success: true,
      message: 'Berhasil mendapatkan riwayat pembayaran',
      data: result
    });
  } catch (error) {
    console.error('Error in getPaymentHistory controller:', error);
    if (error instanceof Error && error.message === 'Payment not found') {
      return res.status(404).json({
        success: false,
        message: 'Pembayaran tidak ditemukan'
      });
    }
    return res.status(500).json({
      success: false,
      message: 'Terjadi kesalahan saat mendapatkan riwayat pembayaran',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

export const checkPaymentStatus = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const status = await paymentService.checkPaymentStatus(id);

    res.json({
      success: true,
      message: 'Status pembayaran berhasil diambil',
      data: status
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Terjadi kesalahan saat mengecek status pembayaran',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}; 
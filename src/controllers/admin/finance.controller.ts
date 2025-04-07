import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { AdminRole } from '../../models/user/admin.model';
import Joi from 'joi';

const prisma = new PrismaClient();

interface CustomRequest extends Request {
  user?: {
    id: string;
    email: string;
    role: string;
  };
}

// Middleware untuk memverifikasi role finance
const verifyFinance = (req: CustomRequest, res: Response, next: Function) => {
  if (!req.user || req.user.role !== AdminRole.FINANCE) {
    return res.status(403).json({
      success: false,
      message: 'Anda tidak memiliki akses untuk melakukan operasi ini'
    });
  }
  next();
};

// Schema validasi untuk transaksi
const transactionSchema = Joi.object({
  type: Joi.string().valid('income', 'expense').required(),
  amount: Joi.number().positive().required(),
  description: Joi.string().required(),
  category: Joi.string().required()
});

// Schema validasi untuk laporan
const reportSchema = Joi.object({
  type: Joi.string().valid('daily', 'weekly', 'monthly', 'yearly').required(),
  startDate: Joi.date().required(),
  endDate: Joi.date().required()
});

// Dapatkan semua transaksi
export const getTransactions = async (req: CustomRequest, res: Response) => {
  try {
    // Verifikasi role
    if (!req.user || req.user.role !== AdminRole.FINANCE) {
      return res.status(403).json({
        success: false,
        message: 'Anda tidak memiliki akses untuk melihat transaksi'
      });
    }

    const transactions = await prisma.financeTransaction.findMany({
      orderBy: {
        createdAt: 'desc'
      }
    });

    return res.json({
      success: true,
      data: transactions
    });
  } catch (error) {
    console.error('Error getting transactions:', error);
    return res.status(500).json({
      success: false,
      message: 'Terjadi kesalahan server'
    });
  }
};

// Dapatkan transaksi by ID
export const getTransactionById = async (req: CustomRequest, res: Response) => {
  try {
    // Verifikasi role
    if (!req.user || req.user.role !== AdminRole.FINANCE) {
      return res.status(403).json({
        success: false,
        message: 'Anda tidak memiliki akses untuk melihat transaksi'
      });
    }

    const { id } = req.params;
    const transaction = await prisma.financeTransaction.findUnique({
      where: { id }
    });

    if (!transaction) {
      return res.status(404).json({
        success: false,
        message: 'Transaksi tidak ditemukan'
      });
    }

    return res.json({
      success: true,
      data: transaction
    });
  } catch (error) {
    console.error('Error getting transaction:', error);
    return res.status(500).json({
      success: false,
      message: 'Terjadi kesalahan server'
    });
  }
};

// Buat transaksi baru
export const createTransaction = async (req: CustomRequest, res: Response) => {
  try {
    // Verifikasi role
    if (!req.user || req.user.role !== AdminRole.FINANCE) {
      return res.status(403).json({
        success: false,
        message: 'Anda tidak memiliki akses untuk membuat transaksi'
      });
    }

    const { error } = transactionSchema.validate(req.body);
    if (error) {
      return res.status(400).json({
        success: false,
        message: error.details[0].message
      });
    }

    const transaction = await prisma.financeTransaction.create({
      data: req.body
    });

    return res.status(201).json({
      success: true,
      message: 'Transaksi berhasil dibuat',
      data: transaction
    });
  } catch (error) {
    console.error('Error creating transaction:', error);
    return res.status(500).json({
      success: false,
      message: 'Terjadi kesalahan server'
    });
  }
};

// Update transaksi
export const updateTransaction = async (req: CustomRequest, res: Response) => {
  try {
    // Verifikasi role
    if (!req.user || req.user.role !== AdminRole.FINANCE) {
      return res.status(403).json({
        success: false,
        message: 'Anda tidak memiliki akses untuk mengupdate transaksi'
      });
    }

    const { id } = req.params;
    const { error } = transactionSchema.validate(req.body);
    if (error) {
      return res.status(400).json({
        success: false,
        message: error.details[0].message
      });
    }

    const transaction = await prisma.financeTransaction.update({
      where: { id },
      data: req.body
    });

    return res.json({
      success: true,
      message: 'Transaksi berhasil diupdate',
      data: transaction
    });
  } catch (error) {
    console.error('Error updating transaction:', error);
    return res.status(500).json({
      success: false,
      message: 'Terjadi kesalahan server'
    });
  }
};

// Generate laporan keuangan
export const generateReport = async (req: CustomRequest, res: Response) => {
  try {
    // Verifikasi role
    if (!req.user || req.user.role !== AdminRole.FINANCE) {
      return res.status(403).json({
        success: false,
        message: 'Anda tidak memiliki akses untuk membuat laporan'
      });
    }

    const { error } = reportSchema.validate(req.body);
    if (error) {
      return res.status(400).json({
        success: false,
        message: error.details[0].message
      });
    }

    const { type, startDate, endDate } = req.body;

    // Hitung total pendapatan dan pengeluaran
    const income = await prisma.financeTransaction.aggregate({
      where: {
        type: 'income',
        createdAt: {
          gte: startDate,
          lte: endDate
        }
      },
      _sum: {
        amount: true
      }
    });

    const expense = await prisma.financeTransaction.aggregate({
      where: {
        type: 'expense',
        createdAt: {
          gte: startDate,
          lte: endDate
        }
      },
      _sum: {
        amount: true
      }
    });

    const report = await prisma.financeReport.create({
      data: {
        type,
        startDate,
        endDate,
        totalIncome: income._sum.amount || 0,
        totalExpense: expense._sum.amount || 0,
        netIncome: (income._sum.amount || 0) - (expense._sum.amount || 0)
      }
    });

    return res.status(201).json({
      success: true,
      message: 'Laporan berhasil dibuat',
      data: report
    });
  } catch (error) {
    console.error('Error generating report:', error);
    return res.status(500).json({
      success: false,
      message: 'Terjadi kesalahan server'
    });
  }
};

// Dapatkan statistik keuangan
export const getFinanceStatistics = async (req: CustomRequest, res: Response) => {
  try {
    // Verifikasi role
    if (!req.user || req.user.role !== AdminRole.FINANCE) {
      return res.status(403).json({
        success: false,
        message: 'Anda tidak memiliki akses untuk melihat statistik'
      });
    }

    const totalIncome = await prisma.financeTransaction.aggregate({
      where: { type: 'income' },
      _sum: { amount: true }
    });

    const totalExpense = await prisma.financeTransaction.aggregate({
      where: { type: 'expense' },
      _sum: { amount: true }
    });

    const pendingTransactions = await prisma.financeTransaction.count({
      where: { status: 'pending' }
    });

    const completedTransactions = await prisma.financeTransaction.count({
      where: { status: 'completed' }
    });

    return res.json({
      success: true,
      data: {
        totalIncome: totalIncome._sum.amount || 0,
        totalExpense: totalExpense._sum.amount || 0,
        netIncome: (totalIncome._sum.amount || 0) - (totalExpense._sum.amount || 0),
        pendingTransactions,
        completedTransactions
      }
    });
  } catch (error) {
    console.error('Error getting finance statistics:', error);
    return res.status(500).json({
      success: false,
      message: 'Terjadi kesalahan server'
    });
  }
}; 
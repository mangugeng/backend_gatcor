import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { AdminRole } from '../../models/user/admin.model';

const prisma = new PrismaClient();

interface FinanceTransaction {
  id: string;
  type: string;
  amount: number;
  description: string;
  category: string;
  status: string;
  createdAt: Date;
  updatedAt: Date;
}

export const createFinanceTransaction = async (req: Request, res: Response) => {
  try {
    const { type, amount, description, category } = req.body;

    // Verifikasi role dari token
    const userRole = (req as any).user.role;
    if (userRole !== AdminRole.FINANCE) {
      return res.status(403).json({
        success: false,
        message: 'Anda tidak memiliki akses untuk membuat transaksi keuangan'
      });
    }

    const transaction = await prisma.financeTransaction.create({
      data: {
        type,
        amount,
        description,
        category,
        status: 'pending'
      }
    });

    return res.status(201).json({
      success: true,
      message: 'Transaksi keuangan berhasil dibuat',
      data: {
        transaction
      }
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Terjadi kesalahan server'
    });
  }
};

export const getFinanceTransactions = async (req: Request, res: Response) => {
  try {
    // Verifikasi role dari token
    const userRole = (req as any).user.role;
    if (userRole !== AdminRole.FINANCE) {
      return res.status(403).json({
        success: false,
        message: 'Anda tidak memiliki akses untuk melihat transaksi keuangan'
      });
    }

    const transactions = await prisma.financeTransaction.findMany();

    return res.status(200).json({
      success: true,
      message: 'Data transaksi keuangan berhasil diambil',
      data: {
        transactions
      }
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Terjadi kesalahan server'
    });
  }
};

export const getFinanceTransactionById = async (req: Request, res: Response) => {
  try {
    // Verifikasi role dari token
    const userRole = (req as any).user.role;
    if (userRole !== 'admin' && userRole !== 'finance') {
      return res.status(403).json({
        success: false,
        message: 'Anda tidak memiliki akses untuk melihat transaksi keuangan'
      });
    }

    const transaction = await prisma.financeTransaction.findUnique({
      where: {
        id: req.params.id
      }
    });

    if (!transaction) {
      return res.status(404).json({
        success: false,
        message: 'Transaksi tidak ditemukan'
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Data transaksi keuangan berhasil diambil',
      data: {
        transaction
      }
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Terjadi kesalahan server'
    });
  }
};

export const updateFinanceTransaction = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    // Verifikasi role dari token
    const userRole = (req as any).user.role;
    if (userRole !== AdminRole.FINANCE) {
      return res.status(403).json({
        success: false,
        message: 'Anda tidak memiliki akses untuk mengubah transaksi keuangan'
      });
    }

    const transaction = await prisma.financeTransaction.update({
      where: { id },
      data: { status }
    });

    return res.status(200).json({
      success: true,
      message: 'Status transaksi berhasil diperbarui',
      data: {
        transaction
      }
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Terjadi kesalahan server'
    });
  }
};

export const generateFinanceReport = async (req: Request, res: Response) => {
  try {
    const { type, startDate, endDate } = req.body;

    // Verifikasi role dari token
    const userRole = (req as any).user.role;
    if (userRole !== 'admin' && userRole !== 'finance') {
      return res.status(403).json({
        success: false,
        message: 'Anda tidak memiliki akses untuk membuat laporan keuangan'
      });
    }

    // Hitung total pendapatan dan pengeluaran
    const transactions = await prisma.financeTransaction.findMany({
      where: {
        createdAt: {
          gte: new Date(startDate),
          lte: new Date(endDate)
        },
        status: 'completed'
      }
    });

    const totalIncome = transactions
      .filter((t: FinanceTransaction) => t.type === 'income')
      .reduce((sum: number, t: FinanceTransaction) => sum + t.amount, 0);

    const totalExpense = transactions
      .filter((t: FinanceTransaction) => t.type === 'expense')
      .reduce((sum: number, t: FinanceTransaction) => sum + t.amount, 0);

    const netIncome = totalIncome - totalExpense;

    // Simpan laporan
    const report = await prisma.financeReport.create({
      data: {
        type,
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        totalIncome,
        totalExpense,
        netIncome
      }
    });

    return res.status(201).json({
      success: true,
      message: 'Laporan keuangan berhasil dibuat',
      data: {
        report
      }
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Terjadi kesalahan server'
    });
  }
};

export const getFinanceStatistics = async (req: Request, res: Response) => {
  try {
    // Verifikasi role dari token
    const userRole = (req as any).user.role;
    if (userRole !== AdminRole.FINANCE) {
      return res.status(403).json({
        success: false,
        message: 'Anda tidak memiliki akses untuk melihat statistik keuangan'
      });
    }

    // Hitung total transaksi
    const totalTransactions = await prisma.financeTransaction.count();

    // Hitung total transaksi berdasarkan status
    const pendingTransactions = await prisma.financeTransaction.count({
      where: {
        status: 'pending'
      }
    });

    const completedTransactions = await prisma.financeTransaction.count({
      where: {
        status: 'completed'
      }
    });

    const cancelledTransactions = await prisma.financeTransaction.count({
      where: {
        status: 'cancelled'
      }
    });

    // Hitung total pendapatan dan pengeluaran bulan ini
    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);

    const endOfMonth = new Date();
    endOfMonth.setMonth(endOfMonth.getMonth() + 1);
    endOfMonth.setDate(0);
    endOfMonth.setHours(23, 59, 59, 999);

    const monthlyTransactions = await prisma.financeTransaction.findMany({
      where: {
        createdAt: {
          gte: startOfMonth,
          lte: endOfMonth
        },
        status: 'completed'
      }
    });

    const monthlyIncome = monthlyTransactions
      .filter((t: FinanceTransaction) => t.type === 'income')
      .reduce((sum: number, t: FinanceTransaction) => sum + t.amount, 0);

    const monthlyExpense = monthlyTransactions
      .filter((t: FinanceTransaction) => t.type === 'expense')
      .reduce((sum: number, t: FinanceTransaction) => sum + t.amount, 0);

    return res.status(200).json({
      success: true,
      message: 'Data statistik keuangan berhasil diambil',
      data: {
        statistics: {
          totalTransactions,
          pendingTransactions,
          completedTransactions,
          cancelledTransactions,
          monthlyIncome,
          monthlyExpense,
          monthlyNetIncome: monthlyIncome - monthlyExpense
        }
      }
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Terjadi kesalahan server'
    });
  }
}; 
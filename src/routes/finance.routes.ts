import { Router } from 'express';
import { FinanceController } from '../controllers/finance.controller';

const router = Router();
const financeController = new FinanceController();

// Endpoint untuk mendapatkan laporan keuangan
router.get('/reports', financeController.getFinancialReports);

// Endpoint untuk mendapatkan statistik transaksi
router.get('/statistics', financeController.getTransactionStatistics);

// Endpoint untuk mendapatkan detail transaksi
router.get('/transactions/:id', financeController.getTransactionDetails);

// Endpoint untuk membuat transaksi baru
router.post('/transactions', financeController.createTransaction);

// Endpoint untuk mengupdate status transaksi
router.put('/transactions/:id/status', financeController.updateTransactionStatus);

export default router; 
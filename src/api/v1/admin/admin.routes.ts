import express from 'express';
import { authenticateUser, requireSuperAdmin, requireCustomerService } from '../../../middleware/auth.middleware';
import {
  validateAdmin,
  validateCustomerServiceTicket,
  validateCustomerServiceReply,
  validateFinanceTransaction,
  validateFinanceReport
} from '../../../middleware/validation.middleware';
import {
  createAdmin,
  getAdminById,
  updateAdmin,
  deleteAdmin,
  getAdminsByRole,
  getCustomerServiceTickets,
  getCustomerServiceTicketById,
  updateCustomerServiceTicket,
  replyCustomerServiceTicket,
  getCustomerServiceStatistics,
  getTechnicalIssues,
  createCustomerServiceTicket
} from '../../../controllers/admin/admin.controller';
import {
  createFinanceTransaction,
  getFinanceTransactions,
  getFinanceTransactionById,
  updateFinanceTransaction,
  generateFinanceReport,
  getFinanceStatistics
} from '../../../controllers/finance/finance.controller';
import technicalRoutes from './technical.routes';
import contentRoutes from './content.routes';
import assetRoutes from './asset.routes';
import templateRoutes from './template.routes';
import workflowRoutes from './workflow.routes';

const router = express.Router();

// Routes yang membutuhkan super admin
router.post('/', authenticateUser, requireSuperAdmin, validateAdmin, createAdmin);
router.get('/:id', authenticateUser, requireSuperAdmin, getAdminById);
router.put('/:id', authenticateUser, requireSuperAdmin, validateAdmin, updateAdmin);
router.delete('/:id', authenticateUser, requireSuperAdmin, deleteAdmin);
router.get('/role/:role', authenticateUser, requireSuperAdmin, getAdminsByRole);

// Customer Service Routes
router.post('/customer-service/tickets', authenticateUser, requireCustomerService, validateCustomerServiceTicket, createCustomerServiceTicket);
router.get('/customer-service/tickets', authenticateUser, requireCustomerService, getCustomerServiceTickets);
router.get('/customer-service/tickets/:id', authenticateUser, requireCustomerService, getCustomerServiceTicketById);
router.put('/customer-service/tickets/:id', authenticateUser, requireCustomerService, updateCustomerServiceTicket);
router.post('/customer-service/tickets/:id/reply', authenticateUser, requireCustomerService, validateCustomerServiceReply, replyCustomerServiceTicket);
router.get('/customer-service/statistics', authenticateUser, requireCustomerService, getCustomerServiceStatistics);

// Admin Technical Routes
router.get('/technical/issues', authenticateUser, getTechnicalIssues);

// Finance Routes
router.get('/finance/transactions', authenticateUser, getFinanceTransactions);
router.get('/finance/transactions/:id', authenticateUser, getFinanceTransactionById);
router.post('/finance/transactions', authenticateUser, validateFinanceTransaction, createFinanceTransaction);
router.put('/finance/transactions/:id', authenticateUser, updateFinanceTransaction);
router.post('/finance/reports', authenticateUser, validateFinanceReport, generateFinanceReport);
router.get('/finance/statistics', authenticateUser, getFinanceStatistics);

// Technical Routes
router.use('/technical', technicalRoutes);

// Content Routes
router.use('/content', contentRoutes);

// Asset Routes
router.use('/assets', assetRoutes);

// Template Routes
router.use('/templates', templateRoutes);

// Workflow Routes
router.use('/workflows', workflowRoutes);

export default router; 
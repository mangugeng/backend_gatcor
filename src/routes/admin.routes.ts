import { Router } from 'express';
import { 
  createAdminController, 
  getAdminController, 
  updateAdminController, 
  deleteAdminController, 
  getAdminsByRoleController 
} from '../controllers/admin/admin.controller';
import { 
  getTickets, 
  getTicketById, 
  updateTicketStatus, 
  replyTicket, 
  getTicketStatistics 
} from '../controllers/admin/customer-service.controller';
import { 
  getIssues, 
  getIssueById, 
  updateIssueStatus, 
  addResolution, 
  getIssueStatistics 
} from '../controllers/admin/technical.controller';
import { 
  getTransactions, 
  getTransactionById, 
  createTransaction, 
  updateTransaction, 
  generateReport, 
  getFinanceStatistics 
} from '../controllers/admin/finance.controller';
import { authenticateUser, requireAdmin, requireSuperAdmin } from '../middleware/auth.middleware';

const router = Router();

// Super Admin routes
router.post('/', authenticateUser, requireSuperAdmin, createAdminController);
router.get('/:id', authenticateUser, requireAdmin, getAdminController);
router.put('/:id', authenticateUser, requireSuperAdmin, updateAdminController);
router.delete('/:id', authenticateUser, requireSuperAdmin, deleteAdminController);
router.get('/role/:role', authenticateUser, requireAdmin, getAdminsByRoleController);

// Customer Service routes
router.get('/customer-service/tickets', authenticateUser, requireAdmin, getTickets);
router.get('/customer-service/tickets/:id', authenticateUser, requireAdmin, getTicketById);
router.put('/customer-service/tickets/:id', authenticateUser, requireAdmin, updateTicketStatus);
router.post('/customer-service/tickets/:id/reply', authenticateUser, requireAdmin, replyTicket);
router.get('/customer-service/statistics', authenticateUser, requireAdmin, getTicketStatistics);

// Technical Admin routes
router.get('/technical/issues', authenticateUser, requireAdmin, getIssues);
router.get('/technical/issues/:id', authenticateUser, requireAdmin, getIssueById);
router.put('/technical/issues/:id', authenticateUser, requireAdmin, updateIssueStatus);
router.post('/technical/issues/:id/resolution', authenticateUser, requireAdmin, addResolution);
router.get('/technical/statistics', authenticateUser, requireAdmin, getIssueStatistics);

// Finance routes
router.get('/finance/transactions', authenticateUser, requireAdmin, getTransactions);
router.get('/finance/transactions/:id', authenticateUser, requireAdmin, getTransactionById);
router.post('/finance/transactions', authenticateUser, requireAdmin, createTransaction);
router.put('/finance/transactions/:id', authenticateUser, requireAdmin, updateTransaction);
router.post('/finance/reports', authenticateUser, requireAdmin, generateReport);
router.get('/finance/statistics', authenticateUser, requireAdmin, getFinanceStatistics);

export default router; 
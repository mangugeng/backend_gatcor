import express from 'express';
import {
  getAllWorkflows,
  getWorkflowById,
  createWorkflow,
  updateWorkflow,
  deleteWorkflow,
  executeWorkflow,
  getWorkflowStatus,
  getWorkflowHistory
} from '../../../controllers/workflow/workflow.controller';
import { authenticateUser } from '../../../middleware/auth';

const router = express.Router();

// Workflow routes
router.get('/', authenticateUser, getAllWorkflows);
router.get('/:id', authenticateUser, getWorkflowById);
router.post('/', authenticateUser, createWorkflow);
router.put('/:id', authenticateUser, updateWorkflow);
router.delete('/:id', authenticateUser, deleteWorkflow);
router.post('/:id/execute', authenticateUser, executeWorkflow);
router.get('/:id/status', authenticateUser, getWorkflowStatus);
router.get('/:id/history', authenticateUser, getWorkflowHistory);

export default router; 
import express from 'express';
import { authenticateUser } from '../../../middleware/auth.middleware';
import {
  createWorkflow,
  getWorkflows,
  getWorkflowById,
  updateWorkflow,
  deleteWorkflow
} from '../../../controllers/admin/workflow.controller';

const router = express.Router();

router.post('/', authenticateUser, createWorkflow);
router.get('/', authenticateUser, getWorkflows);
router.get('/:id', authenticateUser, getWorkflowById);
router.put('/:id', authenticateUser, updateWorkflow);
router.delete('/:id', authenticateUser, deleteWorkflow);

export default router; 
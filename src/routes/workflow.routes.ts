import { Router } from 'express';
import { WorkflowController } from '../controllers/workflow/workflow.controller';

const router = Router();
const workflowController = new WorkflowController();

// Endpoint untuk membuat workflow baru
router.post('/', workflowController.createWorkflow);

// Endpoint untuk mendapatkan workflow berdasarkan ID
router.get('/:id', workflowController.getWorkflowById);

// Endpoint untuk mengupdate workflow
router.put('/:id', workflowController.updateWorkflow);

// Endpoint untuk menghapus workflow
router.delete('/:id', workflowController.deleteWorkflow);

// Endpoint untuk mendapatkan semua workflow dengan pagination
router.get('/', workflowController.getAllWorkflows);

// Endpoint untuk mengeksekusi workflow
router.post('/:id/execute', workflowController.executeWorkflow);

// Endpoint untuk mendapatkan status workflow
router.get('/:id/status', workflowController.getWorkflowStatus);

// Endpoint untuk mendapatkan history workflow
router.get('/:id/history', workflowController.getWorkflowHistory);

export default router; 
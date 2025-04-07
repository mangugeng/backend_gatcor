import express from 'express';
import { authenticateUser } from '../../../middleware/auth.middleware';
import {
  createTechnicalIssue,
  getIssues,
  getIssueById,
  updateIssueStatus,
  addResolution,
  getIssueStatistics
} from '../../../controllers/admin/technical.controller';

const router = express.Router();

// Technical Admin Routes
router.post('/issues', authenticateUser, createTechnicalIssue);
router.get('/issues', authenticateUser, getIssues);
router.get('/issues/:id', authenticateUser, getIssueById);
router.put('/issues/:id', authenticateUser, updateIssueStatus);
router.post('/issues/:id/resolution', authenticateUser, addResolution);
router.get('/statistics', authenticateUser, getIssueStatistics);

export default router; 
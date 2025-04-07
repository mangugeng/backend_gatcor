import express from 'express';
import { authenticateUser } from '../../../middleware/auth.middleware';
import {
  createContent,
  getContents,
  getContentById,
  updateContent,
  deleteContent
} from '../../../controllers/admin/content.controller';

const router = express.Router();

router.post('/', authenticateUser, createContent);
router.get('/', authenticateUser, getContents);
router.get('/:id', authenticateUser, getContentById);
router.put('/:id', authenticateUser, updateContent);
router.delete('/:id', authenticateUser, deleteContent);

export default router; 
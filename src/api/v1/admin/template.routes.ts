import express from 'express';
import { authenticateUser } from '../../../middleware/auth.middleware';
import {
  createTemplate,
  getTemplates,
  getTemplateById,
  updateTemplate,
  deleteTemplate
} from '../../../controllers/admin/template.controller';

const router = express.Router();

router.post('/', authenticateUser, createTemplate);
router.get('/', authenticateUser, getTemplates);
router.get('/:id', authenticateUser, getTemplateById);
router.put('/:id', authenticateUser, updateTemplate);
router.delete('/:id', authenticateUser, deleteTemplate);

export default router; 
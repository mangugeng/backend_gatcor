import { Router } from 'express';
import {
  createTemplate,
  getTemplateById,
  updateTemplate,
  deleteTemplate,
  getAllTemplates,
  useTemplate,
  createCategory,
  updateCategory,
  deleteCategory,
  getAllCategories
} from '../controllers/template/template.controller';

const router = Router();

// Template routes
router.post('/', createTemplate);
router.get('/:id', getTemplateById);
router.put('/:id', updateTemplate);
router.delete('/:id', deleteTemplate);
router.get('/', getAllTemplates);
router.post('/:id/use', useTemplate);

// Category routes
router.post('/categories', createCategory);
router.put('/categories/:id', updateCategory);
router.delete('/categories/:id', deleteCategory);
router.get('/categories', getAllCategories);

export default router; 
import { Router } from 'express';
import { 
  getAllTemplates,
  getTemplateById,
  createTemplate,
  updateTemplate,
  deleteTemplate,
  useTemplate,
  getAllTemplateCategories,
  createTemplateCategory,
  updateTemplateCategory,
  deleteTemplateCategory
} from '../../../controllers/template/template.controller';
import { authenticateUser } from '../../../middleware/auth';

const router = Router();

// Apply authentication middleware to all routes
router.use(authenticateUser);

// Template Routes
router.get('/', getAllTemplates);
router.get('/:id', getTemplateById);
router.post('/', createTemplate);
router.put('/:id', updateTemplate);
router.delete('/:id', deleteTemplate);
router.post('/:id/use', useTemplate);

// Template Category Routes
router.get('/categories', getAllTemplateCategories);
router.post('/categories', createTemplateCategory);
router.put('/categories/:id', updateTemplateCategory);
router.delete('/categories/:id', deleteTemplateCategory);

export default router; 
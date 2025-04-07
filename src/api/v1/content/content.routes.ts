import { Router } from 'express';
import { 
  getAllContent,
  getContentById,
  createContent,
  updateContent,
  deleteContent,
  getAllContentCategories,
  createContentCategory,
  updateContentCategory,
  deleteContentCategory
} from '../../../controllers/content/content.controller';
import { authenticateUser } from '../../../middleware/auth';

const router = Router();

// Apply authentication middleware to all routes
router.use(authenticateUser);

// Content Routes
router.get('/', getAllContent);
router.get('/:id', getContentById);
router.post('/', createContent);
router.put('/:id', updateContent);
router.delete('/:id', deleteContent);

// Content Category Routes
router.get('/categories', getAllContentCategories);
router.post('/categories', createContentCategory);
router.put('/categories/:id', updateContentCategory);
router.delete('/categories/:id', deleteContentCategory);

export default router; 
import { Router } from 'express';
import { 
  getAllCatalogItems,
  getCatalogItemById,
  createCatalogItem,
  updateCatalogItem,
  deleteCatalogItem,
  getAllCatalogCategories,
  createCatalogCategory,
  updateCatalogCategory,
  deleteCatalogCategory
} from '../../../controllers/catalog/catalog.controller';
import { authenticateUser } from '../../../middleware/auth';

const router = Router();

// Apply authentication middleware to all routes
router.use(authenticateUser);

// Catalog Item Routes
router.get('/', getAllCatalogItems);
router.get('/:id', getCatalogItemById);
router.post('/', createCatalogItem);
router.put('/:id', updateCatalogItem);
router.delete('/:id', deleteCatalogItem);

// Catalog Category Routes
router.get('/categories', getAllCatalogCategories);
router.post('/categories', createCatalogCategory);
router.put('/categories/:id', updateCatalogCategory);
router.delete('/categories/:id', deleteCatalogCategory);

export default router; 
import { Router } from 'express';
import {
  createCatalog,
  getCatalogById,
  updateCatalog,
  deleteCatalog,
  getAllCatalogs,
  createCategory,
  getCategoryById,
  updateCategory,
  deleteCategory,
  getAllCategories
} from '../controllers/catalog/catalog.controller';

const router = Router();

// Catalog routes
router.post('/', createCatalog);
router.get('/:id', getCatalogById);
router.put('/:id', updateCatalog);
router.delete('/:id', deleteCatalog);
router.get('/', getAllCatalogs);

// Category routes
router.post('/categories', createCategory);
router.get('/categories/:id', getCategoryById);
router.put('/categories/:id', updateCategory);
router.delete('/categories/:id', deleteCategory);
router.get('/categories', getAllCategories);

export default router; 
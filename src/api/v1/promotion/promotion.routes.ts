import express from 'express';
import {
  createPromotion,
  getAllPromotions,
  getPromotionById,
  updatePromotion,
  deletePromotion,
  activatePromotion,
  deactivatePromotion
} from '../../../controllers/promotion/promotion.controller';
import { authenticateUser } from '../../../middleware/auth';

const router = express.Router();

// Apply authentication middleware to all routes
router.use(authenticateUser);

// Promotion routes
router.post('/', createPromotion);
router.get('/', getAllPromotions);
router.get('/:id', getPromotionById);
router.put('/:id', updatePromotion);
router.delete('/:id', deletePromotion);
router.post('/:id/activate', activatePromotion);
router.post('/:id/deactivate', deactivatePromotion);

export default router; 
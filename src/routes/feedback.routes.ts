import { Router } from 'express';
import {
  getAllFeedback,
  getFeedbackById,
  createFeedback,
  updateFeedback,
  deleteFeedback
} from '../controllers/feedback/feedback.controller';

const router = Router();

// Feedback routes
router.get('/', getAllFeedback);
router.get('/:id', getFeedbackById);
router.post('/', createFeedback);
router.put('/:id', updateFeedback);
router.delete('/:id', deleteFeedback);

export default router; 
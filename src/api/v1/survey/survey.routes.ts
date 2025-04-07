import express from 'express';
import { 
  getAllSurveys,
  getSurveyById,
  createSurvey,
  updateSurvey,
  deleteSurvey,
  submitSurveyResponse,
  getSurveyResponses,
  getAllFeedback,
  submitFeedback,
  getFeedbackById,
  updateFeedback,
  deleteFeedback
} from '../../../controllers/survey/survey.controller';
import { authenticateUser } from '../../../middleware/auth';

const router = express.Router();

// Apply authentication middleware to all routes
router.use(authenticateUser);

// Survey routes
router.get('/', getAllSurveys);
router.get('/:id', getSurveyById);
router.post('/', createSurvey);
router.put('/:id', updateSurvey);
router.delete('/:id', deleteSurvey);
router.post('/:id/responses', submitSurveyResponse);
router.get('/:id/responses', getSurveyResponses);

// Feedback Routes
router.get('/feedback', getAllFeedback);
router.post('/feedback', submitFeedback);
router.get('/feedback/:id', getFeedbackById);
router.put('/feedback/:id', updateFeedback);
router.delete('/feedback/:id', deleteFeedback);

export default router; 
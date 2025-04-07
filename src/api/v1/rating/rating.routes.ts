import { Router } from 'express';
import { 
  createRating, 
  getAllRatings, 
  getRatingById, 
  updateRating, 
  deleteRating, 
  getUserRatings, 
  getOrderRatings 
} from '../../../controllers/rating/rating.controller';
import { authenticateUser } from '../../../middleware/auth';

const router = Router();

// Apply authentication middleware to all routes
router.use(authenticateUser);

// Rating Routes
router.post('/', createRating);
router.get('/', getAllRatings);
router.get('/:id', getRatingById);
router.put('/:id', updateRating);
router.delete('/:id', deleteRating);
router.get('/user/:userId', getUserRatings);
router.get('/order/:orderId', getOrderRatings);

export default router; 
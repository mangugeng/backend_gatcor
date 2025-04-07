import { Router } from 'express';
import { 
  createNotification, 
  getAllNotifications, 
  getNotificationById, 
  updateNotification, 
  deleteNotification, 
  getUserNotifications, 
  markAsRead 
} from '../../../controllers/notification/notification.controller';
import { authenticateUser } from '../../../middleware/auth';

const router = Router();

// Apply authentication middleware to all routes
router.use(authenticateUser);

// Notification Routes
router.post('/', createNotification);
router.get('/', getAllNotifications);
router.get('/:id', getNotificationById);
router.put('/:id', updateNotification);
router.delete('/:id', deleteNotification);
router.get('/user/:userId', getUserNotifications);
router.put('/:id/read', markAsRead);

export default router; 
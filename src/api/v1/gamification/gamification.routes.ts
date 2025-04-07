import express from 'express';
import {
  getUserPoints,
  getUserBadges,
  getUserLevel,
  getUserAchievements,
  getLeaderboard,
  redeemReward,
  getAvailableRewards
} from '../../../controllers/gamification/gamification.controller';
import { authenticateUser } from '../../../middleware/auth';

const router = express.Router();

// Apply authentication middleware to all routes
router.use(authenticateUser);

// Gamification Routes
router.get('/points/:userId', getUserPoints);
router.get('/badges/:userId', getUserBadges);
router.get('/level/:userId', getUserLevel);
router.get('/achievements/:userId', getUserAchievements);
router.get('/leaderboard', getLeaderboard);
router.post('/redeem', redeemReward);
router.get('/rewards', getAvailableRewards);

export default router; 
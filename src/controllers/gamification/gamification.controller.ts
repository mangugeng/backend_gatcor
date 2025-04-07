import { Request, Response } from 'express';
import { GamificationService } from '../../services/gamification.service';

const gamificationService = new GamificationService();

export const getUserPoints = async (req: Request, res: Response) => {
  try {
    return res.status(200).json({
      success: true,
      message: 'Data poin pengguna berhasil diambil',
      data: { userId: req.params.userId, points: 100 }
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Terjadi kesalahan server'
    });
  }
};

export const getUserBadges = async (req: Request, res: Response) => {
  try {
    return res.status(200).json({
      success: true,
      message: 'Data badge pengguna berhasil diambil',
      data: { userId: req.params.userId, badges: [] }
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Terjadi kesalahan server'
    });
  }
};

export const getUserLevel = async (req: Request, res: Response) => {
  try {
    return res.status(200).json({
      success: true,
      message: 'Data level pengguna berhasil diambil',
      data: { userId: req.params.userId, level: 1 }
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Terjadi kesalahan server'
    });
  }
};

export const getUserAchievements = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    
    const achievements = await gamificationService.getUserAchievements(userId);

    return res.status(200).json({
      success: true,
      message: 'User achievements retrieved successfully',
      data: achievements
    });
  } catch (error) {
    console.error('Error in getUserAchievements controller:', error);
    if (error instanceof Error && error.message === 'User not found') {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }
    return res.status(500).json({
      success: false,
      message: 'Failed to get user achievements',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

export const getLeaderboard = async (req: Request, res: Response) => {
  try {
    const { limit } = req.query;
    
    const leaderboard = await gamificationService.getLeaderboard(
      limit ? parseInt(limit as string) : undefined
    );

    return res.status(200).json({
      success: true,
      message: 'Leaderboard retrieved successfully',
      data: leaderboard
    });
  } catch (error) {
    console.error('Error in getLeaderboard controller:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to get leaderboard',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

export const redeemReward = async (req: Request, res: Response) => {
  try {
    return res.status(200).json({
      success: true,
      message: 'Reward berhasil ditebus',
      data: req.body
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Terjadi kesalahan server'
    });
  }
};

export const getAvailableRewards = async (req: Request, res: Response) => {
  try {
    return res.status(200).json({
      success: true,
      message: 'Daftar reward tersedia berhasil diambil',
      data: []
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Terjadi kesalahan server'
    });
  }
};

export const getAllAchievements = async (req: Request, res: Response) => {
  try {
    const achievements = await gamificationService.getAllAchievements();

    return res.status(200).json({
      success: true,
      message: 'Achievements retrieved successfully',
      data: achievements
    });
  } catch (error) {
    console.error('Error in getAllAchievements controller:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to get achievements',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

export const getAchievementById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    
    const achievement = await gamificationService.getAchievementById(id);

    return res.status(200).json({
      success: true,
      message: 'Achievement retrieved successfully',
      data: achievement
    });
  } catch (error) {
    console.error('Error in getAchievementById controller:', error);
    if (error instanceof Error && error.message === 'Achievement not found') {
      return res.status(404).json({
        success: false,
        message: 'Achievement not found'
      });
    }
    return res.status(500).json({
      success: false,
      message: 'Failed to get achievement',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

export const createReward = async (req: Request, res: Response) => {
  try {
    const { name, description, points, type, expiryDate } = req.body;
    
    if (!name || !description || !points || !type) {
      return res.status(400).json({
        success: false,
        message: 'Name, description, points, and type are required'
      });
    }

    const reward = await gamificationService.createReward({
      name,
      description,
      points,
      type,
      expiryDate: expiryDate ? new Date(expiryDate) : undefined
    });

    return res.status(201).json({
      success: true,
      message: 'Reward created successfully',
      data: reward
    });
  } catch (error) {
    console.error('Error in createReward controller:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to create reward',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

export const getAllRewards = async (req: Request, res: Response) => {
  try {
    const rewards = await gamificationService.getAllRewards();

    return res.status(200).json({
      success: true,
      message: 'Rewards retrieved successfully',
      data: rewards
    });
  } catch (error) {
    console.error('Error in getAllRewards controller:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to get rewards',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

export const getUserRewards = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    
    const rewards = await gamificationService.getUserRewards(userId);

    return res.status(200).json({
      success: true,
      message: 'User rewards retrieved successfully',
      data: rewards
    });
  } catch (error) {
    console.error('Error in getUserRewards controller:', error);
    if (error instanceof Error && error.message === 'User not found') {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }
    return res.status(500).json({
      success: false,
      message: 'Failed to get user rewards',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}; 
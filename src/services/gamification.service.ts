import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export class GamificationService {
  async getLeaderboard(limit: number = 10) {
    try {
      const users = await prisma.user.findMany({
        select: {
          id: true,
          name: true,
          points: true,
          level: true,
          achievements: {
            select: {
              achievement: {
                select: {
                  id: true,
                  name: true,
                  points: true
                }
              }
            }
          }
        },
        orderBy: {
          points: 'desc'
        },
        take: limit
      });

      return users.map(user => ({
        id: user.id,
        name: user.name,
        points: user.points,
        level: user.level,
        achievements: user.achievements.map(a => ({
          id: a.achievement.id,
          name: a.achievement.name,
          points: a.achievement.points
        }))
      }));
    } catch (error) {
      console.error('Error in getLeaderboard:', error);
      throw new Error('Failed to get leaderboard');
    }
  }

  async getAllAchievements() {
    try {
      const achievements = await prisma.achievement.findMany({
        include: {
          users: {
            select: {
              user: {
                select: {
                  id: true,
                  name: true
                }
              }
            }
          }
        }
      });

      return achievements.map(achievement => ({
        id: achievement.id,
        name: achievement.name,
        description: achievement.description,
        points: achievement.points,
        type: achievement.type,
        users: achievement.users.map(u => ({
          id: u.user.id,
          name: u.user.name
        }))
      }));
    } catch (error) {
      console.error('Error in getAllAchievements:', error);
      throw new Error('Failed to get achievements');
    }
  }

  async getAchievementById(id: string) {
    try {
      const achievement = await prisma.achievement.findUnique({
        where: { id },
        include: {
          users: {
            select: {
              user: {
                select: {
                  id: true,
                  name: true
                }
              }
            }
          }
        }
      });

      if (!achievement) {
        throw new Error('Achievement not found');
      }

      return {
        id: achievement.id,
        name: achievement.name,
        description: achievement.description,
        points: achievement.points,
        type: achievement.type,
        users: achievement.users.map(u => ({
          id: u.user.id,
          name: u.user.name
        }))
      };
    } catch (error) {
      console.error('Error in getAchievementById:', error);
      throw new Error('Failed to get achievement');
    }
  }

  async getUserAchievements(userId: string) {
    try {
      const user = await prisma.user.findUnique({
        where: { id: userId },
        include: {
          achievements: {
            include: {
              achievement: true
            }
          }
        }
      });

      if (!user) {
        throw new Error('User not found');
      }

      return user.achievements.map(ua => ({
        id: ua.achievement.id,
        name: ua.achievement.name,
        description: ua.achievement.description,
        points: ua.achievement.points,
        type: ua.achievement.type,
        earnedAt: ua.earnedAt
      }));
    } catch (error) {
      console.error('Error in getUserAchievements:', error);
      throw new Error('Failed to get user achievements');
    }
  }

  async createReward(data: {
    name: string;
    description: string;
    points: number;
    type: string;
    expiryDate?: Date;
  }) {
    try {
      const reward = await prisma.reward.create({
        data: {
          name: data.name,
          description: data.description,
          points: data.points,
          type: data.type,
          expiryDate: data.expiryDate
        }
      });

      return reward;
    } catch (error) {
      console.error('Error in createReward:', error);
      throw new Error('Failed to create reward');
    }
  }

  async getAllRewards() {
    try {
      const rewards = await prisma.reward.findMany({
        include: {
          users: {
            select: {
              user: {
                select: {
                  id: true,
                  name: true
                }
              }
            }
          }
        }
      });

      return rewards.map(reward => ({
        id: reward.id,
        name: reward.name,
        description: reward.description,
        points: reward.points,
        type: reward.type,
        expiryDate: reward.expiryDate,
        users: reward.users.map(u => ({
          id: u.user.id,
          name: u.user.name
        }))
      }));
    } catch (error) {
      console.error('Error in getAllRewards:', error);
      throw new Error('Failed to get rewards');
    }
  }

  async getUserRewards(userId: string) {
    try {
      const user = await prisma.user.findUnique({
        where: { id: userId },
        include: {
          rewards: {
            include: {
              reward: true
            }
          }
        }
      });

      if (!user) {
        throw new Error('User not found');
      }

      return user.rewards.map(ur => ({
        id: ur.reward.id,
        name: ur.reward.name,
        description: ur.reward.description,
        points: ur.reward.points,
        type: ur.reward.type,
        expiryDate: ur.reward.expiryDate,
        redeemedAt: ur.redeemedAt
      }));
    } catch (error) {
      console.error('Error in getUserRewards:', error);
      throw new Error('Failed to get user rewards');
    }
  }
} 
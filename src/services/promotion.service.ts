import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export class PromotionService {
  async createPromotion(data: {
    name: string;
    description: string;
    code: string;
    type: 'PERCENTAGE' | 'FIXED';
    value: number;
    minOrderAmount?: number;
    maxDiscount?: number;
    startDate: Date;
    endDate: Date;
    maxUses?: number;
    isActive: boolean;
  }) {
    try {
      const promotion = await prisma.promotion.create({
        data: {
          name: data.name,
          description: data.description,
          code: data.code,
          type: data.type,
          value: data.value,
          minOrderAmount: data.minOrderAmount,
          maxDiscount: data.maxDiscount,
          startDate: data.startDate,
          endDate: data.endDate,
          maxUses: data.maxUses,
          isActive: data.isActive
        }
      });

      return promotion;
    } catch (error) {
      console.error('Error in createPromotion:', error);
      throw new Error('Failed to create promotion');
    }
  }

  async getAllPromotions(page: number = 1, limit: number = 10) {
    try {
      const skip = (page - 1) * limit;
      
      const [promotions, total] = await Promise.all([
        prisma.promotion.findMany({
          skip,
          take: limit,
          orderBy: {
            createdAt: 'desc'
          }
        }),
        prisma.promotion.count()
      ]);

      return {
        data: promotions,
        meta: {
          total,
          page,
          limit,
          totalPages: Math.ceil(total / limit)
        }
      };
    } catch (error) {
      console.error('Error in getAllPromotions:', error);
      throw new Error('Failed to get promotions');
    }
  }

  async getPromotionById(id: string) {
    try {
      const promotion = await prisma.promotion.findUnique({
        where: { id }
      });

      if (!promotion) {
        throw new Error('Promotion not found');
      }

      return promotion;
    } catch (error) {
      console.error('Error in getPromotionById:', error);
      throw error;
    }
  }

  async updatePromotion(id: string, data: {
    name?: string;
    description?: string;
    code?: string;
    type?: 'PERCENTAGE' | 'FIXED';
    value?: number;
    minOrderAmount?: number;
    maxDiscount?: number;
    startDate?: Date;
    endDate?: Date;
    maxUses?: number;
    isActive?: boolean;
  }) {
    try {
      const promotion = await prisma.promotion.update({
        where: { id },
        data: {
          ...data,
          updatedAt: new Date()
        }
      });

      return promotion;
    } catch (error) {
      console.error('Error in updatePromotion:', error);
      throw new Error('Failed to update promotion');
    }
  }

  async deletePromotion(id: string) {
    try {
      const promotion = await prisma.promotion.delete({
        where: { id }
      });

      return promotion;
    } catch (error) {
      console.error('Error in deletePromotion:', error);
      throw new Error('Failed to delete promotion');
    }
  }

  async applyPromotion(id: string, orderId: string) {
    try {
      const promotion = await prisma.promotion.findUnique({
        where: { id }
      });

      if (!promotion) {
        throw new Error('Promotion not found');
      }

      if (!promotion.isActive) {
        throw new Error('Promotion is not active');
      }

      const now = new Date();
      if (now < promotion.startDate || now > promotion.endDate) {
        throw new Error('Promotion is not valid at this time');
      }

      const order = await prisma.order.findUnique({
        where: { id: orderId }
      });

      if (!order) {
        throw new Error('Order not found');
      }

      if (promotion.minOrderAmount && order.fare < promotion.minOrderAmount) {
        throw new Error('Order amount is less than minimum required');
      }

      let discount = 0;
      if (promotion.type === 'PERCENTAGE') {
        discount = (order.fare * promotion.value) / 100;
        if (promotion.maxDiscount && discount > promotion.maxDiscount) {
          discount = promotion.maxDiscount;
        }
      } else {
        discount = promotion.value;
      }

      const updatedOrder = await prisma.order.update({
        where: { id: orderId },
        data: {
          discount,
          totalAmount: order.fare - discount,
          promotionId: id
        }
      });

      return updatedOrder;
    } catch (error) {
      console.error('Error in applyPromotion:', error);
      throw error;
    }
  }

  async getActivePromotions() {
    try {
      const now = new Date();
      
      const promotions = await prisma.promotion.findMany({
        where: {
          isActive: true,
          startDate: {
            lte: now
          },
          endDate: {
            gte: now
          }
        },
        orderBy: {
          createdAt: 'desc'
        }
      });

      return promotions;
    } catch (error) {
      console.error('Error in getActivePromotions:', error);
      throw new Error('Failed to get active promotions');
    }
  }
} 
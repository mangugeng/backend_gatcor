import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export class RatingService {
  async getAllRatings(page: number = 1, limit: number = 10) {
    try {
      const skip = (page - 1) * limit;
      
      const [ratings, total] = await Promise.all([
        prisma.rating.findMany({
          skip,
          take: limit,
          include: {
            order: {
              include: {
                customer: {
                  select: {
                    id: true,
                    name: true
                  }
                },
                driver: {
                  select: {
                    id: true,
                    name: true
                  }
                }
              }
            }
          },
          orderBy: {
            createdAt: 'desc'
          }
        }),
        prisma.rating.count()
      ]);

      return {
        data: ratings,
        meta: {
          total,
          page,
          limit,
          totalPages: Math.ceil(total / limit)
        }
      };
    } catch (error) {
      console.error('Error in getAllRatings:', error);
      throw new Error('Failed to get ratings');
    }
  }

  async getRatingById(id: string) {
    try {
      const rating = await prisma.rating.findUnique({
        where: { id },
        include: {
          order: {
            include: {
              customer: {
                select: {
                  id: true,
                  name: true
                }
              },
              driver: {
                select: {
                  id: true,
                  name: true
                }
              }
            }
          }
        }
      });

      if (!rating) {
        throw new Error('Rating not found');
      }

      return rating;
    } catch (error) {
      console.error('Error in getRatingById:', error);
      throw error;
    }
  }

  async getUserRatings(userId: string, page: number = 1, limit: number = 10) {
    try {
      const skip = (page - 1) * limit;
      
      const [ratings, total] = await Promise.all([
        prisma.rating.findMany({
          skip,
          take: limit,
          where: {
            OR: [
              {
                order: {
                  customerId: userId
                }
              },
              {
                order: {
                  driverId: userId
                }
              }
            ]
          },
          include: {
            order: {
              include: {
                customer: {
                  select: {
                    id: true,
                    name: true
                  }
                },
                driver: {
                  select: {
                    id: true,
                    name: true
                  }
                }
              }
            }
          },
          orderBy: {
            createdAt: 'desc'
          }
        }),
        prisma.rating.count({
          where: {
            OR: [
              {
                order: {
                  customerId: userId
                }
              },
              {
                order: {
                  driverId: userId
                }
              }
            ]
          }
        })
      ]);

      return {
        data: ratings,
        meta: {
          total,
          page,
          limit,
          totalPages: Math.ceil(total / limit)
        }
      };
    } catch (error) {
      console.error('Error in getUserRatings:', error);
      throw new Error('Failed to get user ratings');
    }
  }

  async getOrderRatings(orderId: string) {
    try {
      const rating = await prisma.rating.findUnique({
        where: {
          orderId
        },
        include: {
          order: {
            include: {
              customer: {
                select: {
                  id: true,
                  name: true
                }
              },
              driver: {
                select: {
                  id: true,
                  name: true
                }
              }
            }
          }
        }
      });

      return rating;
    } catch (error) {
      console.error('Error in getOrderRatings:', error);
      throw new Error('Failed to get order ratings');
    }
  }

  async updateRating(id: string, data: { rating?: number; review?: string }) {
    try {
      const rating = await prisma.rating.update({
        where: { id },
        data: {
          rating: data.rating,
          review: data.review,
          updatedAt: new Date()
        },
        include: {
          order: {
            include: {
              customer: {
                select: {
                  id: true,
                  name: true
                }
              },
              driver: {
                select: {
                  id: true,
                  name: true
                }
              }
            }
          }
        }
      });

      return rating;
    } catch (error) {
      console.error('Error in updateRating:', error);
      throw new Error('Failed to update rating');
    }
  }

  async deleteRating(id: string) {
    try {
      const rating = await prisma.rating.delete({
        where: { id }
      });

      return rating;
    } catch (error) {
      console.error('Error in deleteRating:', error);
      throw new Error('Failed to delete rating');
    }
  }
} 
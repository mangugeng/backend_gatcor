import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export class ReportService {
  async getOrderReport(startDate: Date, endDate: Date) {
    try {
      const orders = await prisma.order.findMany({
        where: {
          createdAt: {
            gte: startDate,
            lte: endDate
          }
        },
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
        },
        orderBy: {
          createdAt: 'desc'
        }
      });

      const totalOrders = orders.length;
      const totalRevenue = orders.reduce((sum, order) => sum + order.fare, 0);
      const averageOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;

      const statusCounts = orders.reduce((acc, order) => {
        acc[order.status] = (acc[order.status] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);

      return {
        totalOrders,
        totalRevenue,
        averageOrderValue,
        statusCounts,
        orders
      };
    } catch (error) {
      console.error('Error in getOrderReport:', error);
      throw new Error('Failed to get order report');
    }
  }

  async getPaymentReport(startDate: Date, endDate: Date) {
    try {
      const payments = await prisma.payment.findMany({
        where: {
          createdAt: {
            gte: startDate,
            lte: endDate
          }
        },
        include: {
          order: true,
          customer: {
            select: {
              id: true,
              name: true
            }
          }
        },
        orderBy: {
          createdAt: 'desc'
        }
      });

      const totalPayments = payments.length;
      const totalAmount = payments.reduce((sum, payment) => sum + payment.amount, 0);
      const averagePaymentAmount = totalPayments > 0 ? totalAmount / totalPayments : 0;

      const statusCounts = payments.reduce((acc, payment) => {
        acc[payment.status] = (acc[payment.status] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);

      const paymentMethodCounts = payments.reduce((acc, payment) => {
        acc[payment.paymentMethod] = (acc[payment.paymentMethod] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);

      return {
        totalPayments,
        totalAmount,
        averagePaymentAmount,
        statusCounts,
        paymentMethodCounts,
        payments
      };
    } catch (error) {
      console.error('Error in getPaymentReport:', error);
      throw new Error('Failed to get payment report');
    }
  }

  async getDriverReport(startDate: Date, endDate: Date) {
    try {
      const drivers = await prisma.driver.findMany({
        include: {
          orders: {
            where: {
              createdAt: {
                gte: startDate,
                lte: endDate
              }
            }
          },
          ratings: {
            where: {
              createdAt: {
                gte: startDate,
                lte: endDate
              }
            }
          }
        }
      });

      const driverStats = drivers.map(driver => {
        const totalOrders = driver.orders.length;
        const totalEarnings = driver.orders.reduce((sum, order) => sum + order.fare, 0);
        const averageRating = driver.ratings.length > 0
          ? driver.ratings.reduce((sum, rating) => sum + rating.rating, 0) / driver.ratings.length
          : 0;

        return {
          driverId: driver.id,
          name: driver.name,
          totalOrders,
          totalEarnings,
          averageRating
        };
      });

      return {
        totalDrivers: drivers.length,
        driverStats
      };
    } catch (error) {
      console.error('Error in getDriverReport:', error);
      throw new Error('Failed to get driver report');
    }
  }

  async getCustomerReport(startDate: Date, endDate: Date) {
    try {
      const customers = await prisma.customer.findMany({
        include: {
          orders: {
            where: {
              createdAt: {
                gte: startDate,
                lte: endDate
              }
            }
          },
          payments: {
            where: {
              createdAt: {
                gte: startDate,
                lte: endDate
              }
            }
          }
        }
      });

      const customerStats = customers.map(customer => {
        const totalOrders = customer.orders.length;
        const totalSpent = customer.payments.reduce((sum, payment) => sum + payment.amount, 0);
        const averageOrderValue = totalOrders > 0 ? totalSpent / totalOrders : 0;

        return {
          customerId: customer.id,
          name: customer.name,
          totalOrders,
          totalSpent,
          averageOrderValue
        };
      });

      return {
        totalCustomers: customers.length,
        customerStats
      };
    } catch (error) {
      console.error('Error in getCustomerReport:', error);
      throw new Error('Failed to get customer report');
    }
  }

  async getPromotionReport(startDate: Date, endDate: Date) {
    try {
      const promotions = await prisma.promotion.findMany({
        where: {
          createdAt: {
            gte: startDate,
            lte: endDate
          }
        },
        include: {
          orders: {
            where: {
              createdAt: {
                gte: startDate,
                lte: endDate
              }
            }
          }
        }
      });

      const promotionStats = promotions.map(promotion => {
        const totalOrders = promotion.orders.length;
        const totalDiscount = promotion.orders.reduce((sum, order) => sum + (order.discount || 0), 0);

        return {
          promotionId: promotion.id,
          name: promotion.name,
          totalOrders,
          totalDiscount
        };
      });

      return {
        totalPromotions: promotions.length,
        promotionStats
      };
    } catch (error) {
      console.error('Error in getPromotionReport:', error);
      throw new Error('Failed to get promotion report');
    }
  }

  async getRatingReport(startDate: Date, endDate: Date) {
    try {
      const ratings = await prisma.rating.findMany({
        where: {
          createdAt: {
            gte: startDate,
            lte: endDate
          }
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

      const totalRatings = ratings.length;
      const averageRating = totalRatings > 0
        ? ratings.reduce((sum, rating) => sum + rating.rating, 0) / totalRatings
        : 0;

      const ratingDistribution = ratings.reduce((acc, rating) => {
        acc[rating.rating] = (acc[rating.rating] || 0) + 1;
        return acc;
      }, {} as Record<number, number>);

      return {
        totalRatings,
        averageRating,
        ratingDistribution,
        ratings
      };
    } catch (error) {
      console.error('Error in getRatingReport:', error);
      throw new Error('Failed to get rating report');
    }
  }

  async getAnalyticsReport(startDate: Date, endDate: Date) {
    try {
      const [
        orderReport,
        paymentReport,
        driverReport,
        customerReport,
        promotionReport,
        ratingReport
      ] = await Promise.all([
        this.getOrderReport(startDate, endDate),
        this.getPaymentReport(startDate, endDate),
        this.getDriverReport(startDate, endDate),
        this.getCustomerReport(startDate, endDate),
        this.getPromotionReport(startDate, endDate),
        this.getRatingReport(startDate, endDate)
      ]);

      return {
        orderReport,
        paymentReport,
        driverReport,
        customerReport,
        promotionReport,
        ratingReport
      };
    } catch (error) {
      console.error('Error in getAnalyticsReport:', error);
      throw new Error('Failed to get analytics report');
    }
  }
} 
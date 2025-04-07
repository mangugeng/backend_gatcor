import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { createOrderSchema, updateOrderSchema, rateOrderSchema } from '../../utils/validators/order.validator';

const prisma = new PrismaClient();

export const createOrder = async (req: Request, res: Response) => {
  try {
    const { error, value } = createOrderSchema.validate(req.body);
    if (error) {
      return res.status(400).json({
        success: false,
        message: error.details[0].message
      });
    }

    const order = await prisma.order.create({
      data: {
        ...value,
        customerId: req.user.id
      }
    });

    res.json({
      success: true,
      message: 'Order berhasil dibuat',
      data: order
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Terjadi kesalahan saat membuat order',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

export const getOrders = async (req: Request, res: Response) => {
  try {
    const orders = await prisma.order.findMany({
      where: req.user.role === 'customer' 
        ? { customerId: req.user.id }
        : req.user.role === 'driver'
        ? { driverId: req.user.id }
        : {},
      include: {
        customer: {
          select: {
            id: true,
            name: true,
            phone: true
          }
        },
        driver: {
          select: {
            id: true,
            name: true,
            phone: true,
            vehicleType: true,
            licenseNumber: true
          }
        }
      }
    });

    res.json({
      success: true,
      message: 'Daftar order berhasil diambil',
      data: orders
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Terjadi kesalahan saat mengambil data order',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

export const getOrderById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const order = await prisma.order.findUnique({
      where: { id },
      include: {
        customer: {
          select: {
            id: true,
            name: true,
            phone: true
          }
        },
        driver: {
          select: {
            id: true,
            name: true,
            phone: true,
            vehicleType: true,
            licenseNumber: true
          }
        }
      }
    });

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order tidak ditemukan'
      });
    }

    // Cek apakah user memiliki akses ke order ini
    if (req.user.role !== 'admin' && 
        req.user.id !== order.customerId && 
        req.user.id !== order.driverId) {
      return res.status(403).json({
        success: false,
        message: 'Anda tidak memiliki akses ke order ini'
      });
    }

    res.json({
      success: true,
      message: 'Data order berhasil diambil',
      data: order
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Terjadi kesalahan saat mengambil data order',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

export const updateOrder = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { error, value } = updateOrderSchema.validate(req.body);
    if (error) {
      return res.status(400).json({
        success: false,
        message: error.details[0].message
      });
    }

    const order = await prisma.order.findUnique({
      where: { id }
    });

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order tidak ditemukan'
      });
    }

    // Jika driver mencoba mengambil order
    if (value.driverId && req.user.role === 'driver') {
      // Pastikan driver mengupdate dengan ID mereka sendiri
      if (value.driverId !== req.user.id) {
        return res.status(403).json({
          success: false,
          message: 'Anda hanya dapat mengambil order untuk diri sendiri'
        });
      }

      // Pastikan order belum memiliki driver
      if (order.driverId) {
        return res.status(400).json({
          success: false,
          message: 'Order sudah diambil oleh driver lain'
        });
      }

      // Pastikan order masih dalam status pending
      if (order.status !== 'pending') {
        return res.status(400).json({
          success: false,
          message: 'Order tidak dapat diambil karena status sudah ' + order.status
        });
      }
    } else {
      // Untuk update lainnya, cek akses normal
      if (req.user.role !== 'admin' && 
          req.user.id !== order.customerId && 
          req.user.id !== order.driverId) {
        return res.status(403).json({
          success: false,
          message: 'Anda tidak memiliki akses untuk mengubah order ini'
        });
      }
    }

    const updatedOrder = await prisma.order.update({
      where: { id },
      data: value,
      include: {
        customer: {
          select: {
            id: true,
            name: true,
            phone: true
          }
        },
        driver: {
          select: {
            id: true,
            name: true,
            phone: true,
            vehicleType: true,
            licenseNumber: true
          }
        }
      }
    });

    res.json({
      success: true,
      message: 'Order berhasil diperbarui',
      data: updatedOrder
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Terjadi kesalahan saat memperbarui order',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

export const updateOrderStatus = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!['pending', 'accepted', 'in_progress', 'completed', 'cancelled'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Status tidak valid'
      });
    }

    const order = await prisma.order.findUnique({
      where: { id }
    });

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order tidak ditemukan'
      });
    }

    // Cek apakah user memiliki akses untuk update status
    if (req.user.role !== 'admin' && 
        (status === 'accepted' || status === 'in_progress' || status === 'completed') && 
        req.user.id !== order.driverId) {
      return res.status(403).json({
        success: false,
        message: 'Anda tidak memiliki akses untuk mengubah status order ini'
      });
    }

    // Hanya customer yang bisa cancel order
    if (status === 'cancelled' && 
        req.user.role !== 'admin' && 
        req.user.id !== order.customerId) {
      return res.status(403).json({
        success: false,
        message: 'Hanya customer yang dapat membatalkan order'
      });
    }

    const updatedOrder = await prisma.order.update({
      where: { id },
      data: { status },
      include: {
        customer: {
          select: {
            id: true,
            name: true,
            phone: true
          }
        },
        driver: {
          select: {
            id: true,
            name: true,
            phone: true,
            vehicleType: true,
            licenseNumber: true
          }
        }
      }
    });

    res.json({
      success: true,
      message: 'Status order berhasil diperbarui',
      data: updatedOrder
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Terjadi kesalahan saat memperbarui status order',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

export const trackOrder = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const order = await prisma.order.findUnique({
      where: { id },
      include: {
        driver: {
          select: {
            id: true,
            name: true,
            phone: true,
            vehicleType: true,
            licenseNumber: true,
            driverLocation: true
          }
        }
      }
    });

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order tidak ditemukan'
      });
    }

    // Cek apakah user memiliki akses untuk tracking order
    if (req.user.role !== 'admin' && 
        req.user.id !== order.customerId && 
        req.user.id !== order.driverId) {
      return res.status(403).json({
        success: false,
        message: 'Anda tidak memiliki akses untuk tracking order ini'
      });
    }

    res.json({
      success: true,
      message: 'Data tracking order berhasil diambil',
      data: {
        order,
        driverLocation: order.driver?.driverLocation
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Terjadi kesalahan saat mengambil data tracking order',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

export const cancelOrder = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const order = await prisma.order.findUnique({
      where: { id }
    });

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order tidak ditemukan'
      });
    }

    // Cek apakah order masih bisa dibatalkan
    if (!['pending', 'accepted'].includes(order.status)) {
      return res.status(400).json({
        success: false,
        message: 'Order tidak dapat dibatalkan karena status sudah ' + order.status
      });
    }

    // Cek apakah user memiliki akses untuk membatalkan order
    if (req.user.role !== 'admin' && req.user.id !== order.customerId) {
      return res.status(403).json({
        success: false,
        message: 'Anda tidak memiliki akses untuk membatalkan order ini'
      });
    }

    const cancelledOrder = await prisma.order.update({
      where: { id },
      data: { status: 'cancelled' },
      include: {
        customer: {
          select: {
            id: true,
            name: true,
            phone: true
          }
        },
        driver: {
          select: {
            id: true,
            name: true,
            phone: true,
            vehicleType: true,
            licenseNumber: true
          }
        }
      }
    });

    res.json({
      success: true,
      message: 'Order berhasil dibatalkan',
      data: cancelledOrder
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Terjadi kesalahan saat membatalkan order',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

export const rateOrder = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { error, value } = rateOrderSchema.validate(req.body);
    if (error) {
      return res.status(400).json({
        success: false,
        message: error.details[0].message
      });
    }

    const order = await prisma.order.findUnique({
      where: { id }
    });

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order tidak ditemukan'
      });
    }

    // Cek apakah order sudah selesai
    if (order.status !== 'completed') {
      return res.status(400).json({
        success: false,
        message: 'Order belum selesai'
      });
    }

    // Cek apakah user adalah customer dari order ini
    if (req.user.role !== 'admin' && req.user.id !== order.customerId) {
      return res.status(403).json({
        success: false,
        message: 'Anda tidak memiliki akses untuk memberikan rating'
      });
    }

    // Cek apakah order sudah diberi rating
    if (order.rating) {
      return res.status(400).json({
        success: false,
        message: 'Order sudah diberi rating'
      });
    }

    const ratedOrder = await prisma.order.update({
      where: { id },
      data: value,
      include: {
        customer: {
          select: {
            id: true,
            name: true,
            phone: true
          }
        },
        driver: {
          select: {
            id: true,
            name: true,
            phone: true,
            vehicleType: true,
            licenseNumber: true
          }
        }
      }
    });

    res.json({
      success: true,
      message: 'Rating berhasil diberikan',
      data: ratedOrder
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Terjadi kesalahan saat memberikan rating',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

export {
  createOrder,
  getOrders,
  getOrderById,
  updateOrder,
  updateOrderStatus,
  trackOrder,
  cancelOrder,
  rateOrder
}; 
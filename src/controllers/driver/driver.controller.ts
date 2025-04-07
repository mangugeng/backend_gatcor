import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { validateDriverUpdate } from '../../utils/validators/driver.validator';
import { driverStatusSchema, driverLocationSchema, driverUpdateSchema } from '../../utils/validators/driver.validator';

const prisma = new PrismaClient();

export const getDrivers = async (req: Request, res: Response) => {
  try {
    const drivers = await prisma.user.findMany({
      where: {
        role: 'driver'
      },
      select: {
        id: true,
        email: true,
        name: true,
        emailVerified: true,
        vehicleType: true,
        licenseNumber: true,
        createdAt: true,
        updatedAt: true
      }
    });

    res.json({
      success: true,
      message: 'Daftar driver berhasil diambil',
      data: drivers
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Terjadi kesalahan saat mengambil data driver',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

export const getDriverById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const driver = await prisma.user.findUnique({
      where: {
        id,
        role: 'driver'
      },
      select: {
        id: true,
        email: true,
        name: true,
        emailVerified: true,
        vehicleType: true,
        licenseNumber: true,
        createdAt: true,
        updatedAt: true
      }
    });

    if (!driver) {
      return res.status(404).json({
        success: false,
        message: 'Driver tidak ditemukan'
      });
    }

    res.json({
      success: true,
      message: 'Data driver berhasil diambil',
      data: driver
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Terjadi kesalahan saat mengambil data driver',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

export const updateDriver = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { error, value } = validateDriverUpdate(req.body);

    if (error) {
      return res.status(400).json({
        success: false,
        message: 'Data tidak valid',
        error: error.details
      });
    }

    const driver = await prisma.user.findUnique({
      where: {
        id,
        role: 'driver'
      }
    });

    if (!driver) {
      return res.status(404).json({
        success: false,
        message: 'Driver tidak ditemukan'
      });
    }

    const updatedDriver = await prisma.user.update({
      where: { id },
      data: value,
      select: {
        id: true,
        email: true,
        name: true,
        emailVerified: true,
        vehicleType: true,
        licenseNumber: true,
        createdAt: true,
        updatedAt: true
      }
    });

    res.json({
      success: true,
      message: 'Data driver berhasil diperbarui',
      data: updatedDriver
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Terjadi kesalahan saat memperbarui data driver',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

export const deleteDriver = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const driver = await prisma.user.findUnique({
      where: {
        id,
        role: 'driver'
      }
    });

    if (!driver) {
      return res.status(404).json({
        success: false,
        message: 'Driver tidak ditemukan'
      });
    }

    // Hapus data terkait driver terlebih dahulu
    await prisma.driverStatus.deleteMany({
      where: { driverId: id }
    });

    await prisma.driverLocation.deleteMany({
      where: { driverId: id }
    });

    // Hapus driver
    await prisma.user.delete({
      where: { id }
    });

    res.json({
      success: true,
      message: 'Driver berhasil dihapus'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Terjadi kesalahan saat menghapus driver',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

export const getDriverOrders = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const driver = await prisma.user.findUnique({
      where: {
        id,
        role: 'driver'
      }
    });

    if (!driver) {
      return res.status(404).json({
        success: false,
        message: 'Driver tidak ditemukan'
      });
    }

    // TODO: Implementasi setelah model Order dibuat
    res.json({
      success: true,
      message: 'Daftar order driver berhasil diambil',
      data: []
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Terjadi kesalahan saat mengambil data order driver',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

export const getDriverRatings = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const driver = await prisma.user.findUnique({
      where: {
        id,
        role: 'driver'
      }
    });

    if (!driver) {
      return res.status(404).json({
        success: false,
        message: 'Driver tidak ditemukan'
      });
    }

    // TODO: Implementasi setelah model Rating dibuat
    res.json({
      success: true,
      message: 'Daftar rating driver berhasil diambil',
      data: []
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Terjadi kesalahan saat mengambil data rating driver',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

export const getDriverEarnings = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const driver = await prisma.user.findUnique({
      where: {
        id,
        role: 'driver'
      }
    });

    if (!driver) {
      return res.status(404).json({
        success: false,
        message: 'Driver tidak ditemukan'
      });
    }

    // TODO: Implementasi setelah model Payment dibuat
    res.json({
      success: true,
      message: 'Daftar pendapatan driver berhasil diambil',
      data: []
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Terjadi kesalahan saat mengambil data pendapatan driver',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

export const updateDriverStatus = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const { error } = driverStatusSchema.validate({ status });
    if (error) {
      return res.status(400).json({
        success: false,
        message: error.details[0].message
      });
    }

    const driver = await prisma.user.findUnique({
      where: {
        id,
        role: 'driver'
      }
    });

    if (!driver) {
      return res.status(404).json({
        success: false,
        message: 'Driver tidak ditemukan'
      });
    }

    const driverStatus = await prisma.driverStatus.upsert({
      where: { driverId: id },
      update: { status },
      create: {
        driverId: id,
        status
      }
    });

    res.json({
      success: true,
      message: 'Status driver berhasil diperbarui',
      data: driverStatus
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Terjadi kesalahan saat memperbarui status driver',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

export const updateDriverLocation = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { latitude, longitude } = req.body;

    const { error } = driverLocationSchema.validate({ latitude, longitude });
    if (error) {
      return res.status(400).json({
        success: false,
        message: error.details[0].message
      });
    }

    const driver = await prisma.user.findUnique({
      where: {
        id,
        role: 'driver'
      }
    });

    if (!driver) {
      return res.status(404).json({
        success: false,
        message: 'Driver tidak ditemukan'
      });
    }

    const driverLocation = await prisma.driverLocation.upsert({
      where: { driverId: id },
      update: { latitude, longitude },
      create: {
        driverId: id,
        latitude,
        longitude
      }
    });

    res.json({
      success: true,
      message: 'Lokasi driver berhasil diperbarui',
      data: driverLocation
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Terjadi kesalahan saat memperbarui lokasi driver',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}; 
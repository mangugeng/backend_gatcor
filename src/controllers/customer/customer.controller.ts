import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { validateCustomerUpdate } from '../../utils/validators/customer.validator';

const prisma = new PrismaClient();

export const getCustomers = async (req: Request, res: Response) => {
  try {
    const customers = await prisma.user.findMany({
      where: {
        role: 'customer'
      },
      select: {
        id: true,
        email: true,
        name: true,
        emailVerified: true,
        createdAt: true,
        updatedAt: true
      }
    });

    res.json({
      success: true,
      message: 'Daftar customer berhasil diambil',
      data: customers
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Terjadi kesalahan saat mengambil data customer',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

export const getCustomerById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const customer = await prisma.user.findUnique({
      where: {
        id,
        role: 'customer'
      },
      select: {
        id: true,
        email: true,
        name: true,
        emailVerified: true,
        createdAt: true,
        updatedAt: true
      }
    });

    if (!customer) {
      return res.status(404).json({
        success: false,
        message: 'Customer tidak ditemukan'
      });
    }

    res.json({
      success: true,
      message: 'Data customer berhasil diambil',
      data: customer
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Terjadi kesalahan saat mengambil data customer',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

export const updateCustomer = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { error, value } = validateCustomerUpdate(req.body);

    if (error) {
      return res.status(400).json({
        success: false,
        message: 'Data tidak valid',
        error: error.details
      });
    }

    const customer = await prisma.user.findUnique({
      where: {
        id,
        role: 'customer'
      }
    });

    if (!customer) {
      return res.status(404).json({
        success: false,
        message: 'Customer tidak ditemukan'
      });
    }

    const updatedCustomer = await prisma.user.update({
      where: { id },
      data: value,
      select: {
        id: true,
        email: true,
        name: true,
        emailVerified: true,
        createdAt: true,
        updatedAt: true
      }
    });

    res.json({
      success: true,
      message: 'Data customer berhasil diperbarui',
      data: updatedCustomer
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Terjadi kesalahan saat memperbarui data customer',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

export const deleteCustomer = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const customer = await prisma.user.findUnique({
      where: {
        id,
        role: 'customer'
      }
    });

    if (!customer) {
      return res.status(404).json({
        success: false,
        message: 'Customer tidak ditemukan'
      });
    }

    await prisma.user.delete({
      where: { id }
    });

    res.json({
      success: true,
      message: 'Customer berhasil dihapus'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Terjadi kesalahan saat menghapus customer',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

export const getCustomerOrders = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const customer = await prisma.user.findUnique({
      where: {
        id,
        role: 'customer'
      }
    });

    if (!customer) {
      return res.status(404).json({
        success: false,
        message: 'Customer tidak ditemukan'
      });
    }

    // TODO: Implementasi setelah model Order dibuat
    res.json({
      success: true,
      message: 'Daftar order customer berhasil diambil',
      data: []
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Terjadi kesalahan saat mengambil data order customer',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

export const getCustomerRatings = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const customer = await prisma.user.findUnique({
      where: {
        id,
        role: 'customer'
      }
    });

    if (!customer) {
      return res.status(404).json({
        success: false,
        message: 'Customer tidak ditemukan'
      });
    }

    // TODO: Implementasi setelah model Rating dibuat
    res.json({
      success: true,
      message: 'Daftar rating customer berhasil diambil',
      data: []
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Terjadi kesalahan saat mengambil data rating customer',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

export const getCustomerPayments = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const customer = await prisma.user.findUnique({
      where: {
        id,
        role: 'customer'
      }
    });

    if (!customer) {
      return res.status(404).json({
        success: false,
        message: 'Customer tidak ditemukan'
      });
    }

    // TODO: Implementasi setelah model Payment dibuat
    res.json({
      success: true,
      message: 'Daftar pembayaran customer berhasil diambil',
      data: []
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Terjadi kesalahan saat mengambil data pembayaran customer',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}; 
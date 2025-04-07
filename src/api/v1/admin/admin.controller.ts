import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { AdminRole } from '../../../models/user/admin.model';
import { hashPassword } from '../../../utils/helpers/auth.helper';

const prisma = new PrismaClient();

interface CustomRequest extends Request {
  user?: {
    id: string;
    email: string;
    role: string;
  };
}

// Buat admin baru
export const createAdmin = async (req: CustomRequest, res: Response) => {
  try {
    const { email, password, name, role } = req.body;

    // Cek apakah email sudah terdaftar
    const existingAdmin = await prisma.admin.findUnique({
      where: { email }
    });

    if (existingAdmin) {
      return res.status(400).json({
        success: false,
        message: 'Email sudah terdaftar'
      });
    }

    // Hash password
    const hashedPassword = await hashPassword(password);

    // Buat admin baru
    const admin = await prisma.admin.create({
      data: {
        email,
        password: hashedPassword,
        name,
        role,
        isActive: true
      }
    });

    return res.status(201).json({
      success: true,
      message: 'Admin berhasil dibuat',
      data: {
        id: admin.id,
        email: admin.email,
        name: admin.name,
        role: admin.role,
        isActive: admin.isActive
      }
    });
  } catch (error) {
    console.error('Error creating admin:', error);
    return res.status(500).json({
      success: false,
      message: 'Terjadi kesalahan server'
    });
  }
};

// Dapatkan admin by ID
export const getAdminById = async (req: CustomRequest, res: Response) => {
  try {
    // Verifikasi role dari token
    const userRole = req.user?.role;
    if (userRole !== 'SUPER_ADMIN') {
      return res.status(403).json({
        success: false,
        message: 'Anda tidak memiliki akses untuk melihat data admin'
      });
    }

    const admin = await prisma.admin.findUnique({
      where: {
        id: req.params.id
      },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        isActive: true,
        createdAt: true,
        updatedAt: true
      }
    });

    if (!admin) {
      return res.status(404).json({
        success: false,
        message: 'Admin tidak ditemukan'
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Data admin berhasil diambil',
      data: { admin }
    });
  } catch (error) {
    console.error('Error getting admin:', error);
    return res.status(500).json({
      success: false,
      message: 'Terjadi kesalahan server'
    });
  }
};

// Update admin
export const updateAdmin = async (req: CustomRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { email, password, name, role, isActive } = req.body;

    // Cek apakah admin ada
    const existingAdmin = await prisma.admin.findUnique({
      where: { id }
    });

    if (!existingAdmin) {
      return res.status(404).json({
        success: false,
        message: 'Admin tidak ditemukan'
      });
    }

    // Cek apakah email sudah digunakan oleh admin lain
    if (email && email !== existingAdmin.email) {
      const emailExists = await prisma.admin.findUnique({
        where: { email }
      });

      if (emailExists) {
        return res.status(400).json({
          success: false,
          message: 'Email sudah digunakan'
        });
      }
    }

    // Hash password jika ada
    let hashedPassword = existingAdmin.password;
    if (password) {
      hashedPassword = await hashPassword(password);
    }

    // Update admin
    const admin = await prisma.admin.update({
      where: { id },
      data: {
        email,
        password: hashedPassword,
        name,
        role,
        isActive
      }
    });

    return res.json({
      success: true,
      message: 'Admin berhasil diupdate',
      data: {
        id: admin.id,
        email: admin.email,
        name: admin.name,
        role: admin.role,
        isActive: admin.isActive
      }
    });
  } catch (error) {
    console.error('Error updating admin:', error);
    return res.status(500).json({
      success: false,
      message: 'Terjadi kesalahan server'
    });
  }
};

// Hapus admin
export const deleteAdmin = async (req: CustomRequest, res: Response) => {
  try {
    const { id } = req.params;

    // Cek apakah admin ada
    const admin = await prisma.admin.findUnique({
      where: { id }
    });

    if (!admin) {
      return res.status(404).json({
        success: false,
        message: 'Admin tidak ditemukan'
      });
    }

    // Hapus admin
    await prisma.admin.delete({
      where: { id }
    });

    return res.json({
      success: true,
      message: 'Admin berhasil dihapus'
    });
  } catch (error) {
    console.error('Error deleting admin:', error);
    return res.status(500).json({
      success: false,
      message: 'Terjadi kesalahan server'
    });
  }
};

// Dapatkan admin berdasarkan role
export const getAdminsByRole = async (req: CustomRequest, res: Response) => {
  try {
    const { role } = req.params;

    // Validasi role
    if (!Object.values(AdminRole).includes(role as AdminRole)) {
      return res.status(400).json({
        success: false,
        message: 'Role tidak valid'
      });
    }

    const admins = await prisma.admin.findMany({
      where: { role },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        isActive: true
      }
    });

    return res.json({
      success: true,
      data: admins
    });
  } catch (error) {
    console.error('Error getting admins by role:', error);
    return res.status(500).json({
      success: false,
      message: 'Terjadi kesalahan server'
    });
  }
}; 
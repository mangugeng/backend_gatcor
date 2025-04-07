import { Request, Response } from 'express';
import { 
  Admin, 
  AdminRole, 
  createAdmin as createAdminModel, 
  getAdminById as getAdminByIdModel, 
  getAdminByEmail as getAdminByEmailModel, 
  updateAdmin as updateAdminModel, 
  deleteAdmin as deleteAdminModel, 
  getAdminsByRole as getAdminsByRoleModel 
} from '../../models/user/admin.model';
import { hashPassword } from '../../utils/helpers/auth.helper';
import { PrismaClient } from '@prisma/client';
import Joi from 'joi';

const prisma = new PrismaClient();

interface CustomRequest extends Request {
  user?: {
    id: string;
    email: string;
    role: string;
  };
}

const adminSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
  name: Joi.string().required(),
  role: Joi.string().valid(...Object.values(AdminRole)).required()
});

// Middleware untuk memverifikasi role super admin
const verifySuperAdmin = (req: CustomRequest, res: Response, next: Function) => {
  if (!req.user || req.user.role !== AdminRole.SUPER_ADMIN) {
    return res.status(403).json({
      success: false,
      message: 'Anda tidak memiliki akses untuk melakukan operasi ini'
    });
  }
  next();
};

export const createAdminController = async (req: CustomRequest, res: Response) => {
  try {
    // Verifikasi super admin
    if (!req.user || req.user.role !== AdminRole.SUPER_ADMIN) {
      return res.status(403).json({
        success: false,
        message: 'Hanya super admin yang dapat membuat admin baru'
      });
    }

    const { error } = adminSchema.validate(req.body);
    if (error) {
      return res.status(400).json({
        success: false,
        message: error.details[0].message
      });
    }

    const { email, password, name, role } = req.body;
    
    // Validasi role
    if (!Object.values(AdminRole).includes(role)) {
      return res.status(400).json({ 
        success: false,
        message: 'Role tidak valid' 
      });
    }

    const hashedPassword = await hashPassword(password);
    const admin = await createAdminModel({
      email,
      password: hashedPassword,
      name,
      role,
      isActive: true
    });

    res.status(201).json({
      success: true,
      message: 'Admin berhasil dibuat',
      data: {
        admin: {
          id: admin.id,
          email: admin.email,
          name: admin.name,
          role: admin.role,
          isActive: admin.isActive
        }
      }
    });
  } catch (error) {
    console.error('Error creating admin:', error);
    res.status(500).json({ 
      success: false,
      message: 'Terjadi kesalahan server' 
    });
  }
};

export const getAdminController = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const admin = await getAdminByIdModel(id);
    
    if (!admin) {
      return res.status(404).json({ message: 'Admin not found' });
    }

    res.json(admin);
  } catch (error) {
    res.status(500).json({ message: 'Error getting admin' });
  }
};

export const updateAdminController = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const data = req.body;

    // Jika ada password, hash password baru
    if (data.password) {
      data.password = await hashPassword(data.password);
    }

    const admin = await updateAdminModel(id, data);
    
    if (!admin) {
      return res.status(404).json({ message: 'Admin not found' });
    }

    res.json(admin);
  } catch (error) {
    res.status(500).json({ message: 'Error updating admin' });
  }
};

export const deleteAdminController = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const admin = await deleteAdminModel(id);
    
    if (!admin) {
      return res.status(404).json({ message: 'Admin not found' });
    }

    res.json({ message: 'Admin deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting admin' });
  }
};

export const getAdminsByRoleController = async (req: Request, res: Response) => {
  try {
    const { role } = req.params;
    
    // Validasi role
    if (!Object.values(AdminRole).includes(role as AdminRole)) {
      return res.status(400).json({ message: 'Invalid role' });
    }

    const admins = await getAdminsByRoleModel(role as AdminRole);
    res.json(admins);
  } catch (error) {
    res.status(500).json({ message: 'Error getting admins by role' });
  }
};

export const createAdmin = async (req: CustomRequest, res: Response) => {
  try {
    // Validasi input
    const { error } = adminSchema.validate(req.body);
    if (error) {
      return res.status(400).json({
        success: false,
        message: error.details[0].message
      });
    }

    const { email, password, name, role } = req.body;

    // Verifikasi role dari token
    if (!req.user || req.user.role !== 'SUPER_ADMIN') {
      return res.status(403).json({
        success: false,
        message: 'Anda tidak memiliki akses untuk membuat admin'
      });
    }

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
        admin: {
          id: admin.id,
          email: admin.email,
          name: admin.name,
          role: admin.role,
          isActive: admin.isActive
        }
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

export const getAdminById = async (req: Request, res: Response) => {
  try {
    // Verifikasi role dari token
    const userRole = (req as any).user.role;
    if (userRole !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Anda tidak memiliki akses untuk melihat data admin'
      });
    }

    const admin = await prisma.admin.findUnique({
      where: {
        id: req.params.id
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
      data: {
        admin: {
          id: admin.id,
          email: admin.email,
          name: admin.name,
          role: admin.role
        }
      }
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Terjadi kesalahan server'
    });
  }
};

export const updateAdmin = async (req: Request, res: Response) => {
  try {
    const { name, role } = req.body;

    // Verifikasi role dari token
    const userRole = (req as any).user.role;
    if (userRole !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Anda tidak memiliki akses untuk mengubah data admin'
      });
    }

    const admin = await prisma.admin.update({
      where: {
        id: req.params.id
      },
      data: {
        name,
        role
      }
    });

    return res.status(200).json({
      success: true,
      message: 'Data admin berhasil diperbarui',
      data: {
        admin: {
          id: admin.id,
          email: admin.email,
          name: admin.name,
          role: admin.role
        }
      }
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Terjadi kesalahan server'
    });
  }
};

export const deleteAdmin = async (req: Request, res: Response) => {
  try {
    // Verifikasi role dari token
    const userRole = (req as any).user.role;
    if (userRole !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Anda tidak memiliki akses untuk menghapus admin'
      });
    }

    await prisma.admin.delete({
      where: {
        id: req.params.id
      }
    });

    return res.status(200).json({
      success: true,
      message: 'Admin berhasil dihapus',
      data: { id: req.params.id }
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Terjadi kesalahan server'
    });
  }
};

export const getAdminsByRole = async (req: Request, res: Response) => {
  try {
    // Verifikasi role dari token
    const userRole = (req as any).user.role;
    if (userRole !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Anda tidak memiliki akses untuk melihat data admin'
      });
    }

    const admins = await prisma.admin.findMany({
      where: {
        role: req.params.role
      }
    });

    return res.status(200).json({
      success: true,
      message: 'Data admin berhasil diambil',
      data: {
        admins: admins.map(admin => ({
          id: admin.id,
          email: admin.email,
          name: admin.name,
          role: admin.role
        }))
      }
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Terjadi kesalahan server'
    });
  }
};

export const getCustomerServiceTickets = async (req: Request, res: Response) => {
  try {
    // Verifikasi role dari token
    const userRole = (req as any).user.role;
    if (userRole !== 'SUPER_ADMIN' && userRole !== 'CUSTOMER_SERVICE') {
      return res.status(403).json({
        success: false,
        message: 'Anda tidak memiliki akses untuk melihat tiket customer service'
      });
    }

    const tickets = await prisma.customerServiceTicket.findMany({
      include: {
        admin: {
          select: {
            id: true,
            name: true,
            email: true
          }
        },
        replies: true
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    return res.json({
      success: true,
      message: 'Data tiket customer service berhasil diambil',
      data: {
        tickets: tickets.map(ticket => ({
          id: ticket.id,
          status: ticket.status,
          subject: ticket.subject,
          message: ticket.message,
          createdAt: ticket.createdAt,
          admin: ticket.admin,
          replies: ticket.replies.map(reply => ({
            id: reply.id,
            message: reply.message,
            createdAt: reply.createdAt
          }))
        }))
      }
    });
  } catch (error) {
    console.error('Error getting customer service tickets:', error);
    return res.status(500).json({
      success: false,
      message: 'Terjadi kesalahan server'
    });
  }
};

export const getCustomerServiceTicketById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const ticket = await prisma.customerServiceTicket.findUnique({
      where: { id },
      include: {
        admin: {
          select: {
            id: true,
            name: true,
            email: true
          }
        },
        replies: {
          orderBy: {
            createdAt: 'asc'
          }
        }
      }
    });

    if (!ticket) {
      return res.status(404).json({
        success: false,
        message: 'Tiket tidak ditemukan'
      });
    }

    return res.json({
      success: true,
      message: 'Detail tiket customer service berhasil diambil',
      data: {
        ticket: {
          id: ticket.id,
          status: ticket.status,
          subject: ticket.subject,
          message: ticket.message,
          createdAt: ticket.createdAt,
          admin: ticket.admin,
          replies: ticket.replies.map(reply => ({
            id: reply.id,
            message: reply.message,
            createdAt: reply.createdAt
          }))
        }
      }
    });
  } catch (error) {
    console.error('Error getting customer service ticket:', error);
    return res.status(500).json({
      success: false,
      message: 'Terjadi kesalahan server'
    });
  }
};

export const updateCustomerServiceTicket = async (req: Request, res: Response) => {
  try {
    const { status } = req.body;

    // Verifikasi role dari token
    const userRole = (req as any).user.role;
    if (userRole !== 'SUPER_ADMIN' && userRole !== 'CUSTOMER_SERVICE') {
      return res.status(403).json({
        success: false,
        message: 'Anda tidak memiliki akses untuk mengubah tiket customer service'
      });
    }

    const ticket = await prisma.customerServiceTicket.update({
      where: {
        id: req.params.id
      },
      data: {
        status
      },
      include: {
        replies: true
      }
    });

    return res.status(200).json({
      success: true,
      message: 'Data tiket customer service berhasil diperbarui',
      data: {
        ticket: {
          id: ticket.id,
          status: ticket.status,
          subject: ticket.subject,
          message: ticket.message,
          replies: ticket.replies.map(reply => ({
            id: reply.id,
            message: reply.message,
            createdAt: reply.createdAt
          })),
          createdAt: ticket.createdAt
        }
      }
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Terjadi kesalahan server'
    });
  }
};

export const replyCustomerServiceTicket = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { message } = req.body;

    // Verifikasi role dari token
    const userRole = (req as any).user.role;
    if (userRole !== 'SUPER_ADMIN' && userRole !== 'CUSTOMER_SERVICE') {
      return res.status(403).json({
        success: false,
        message: 'Anda tidak memiliki akses untuk membalas tiket customer service'
      });
    }

    // Cek apakah tiket ada
    const ticket = await prisma.customerServiceTicket.findUnique({
      where: { id }
    });

    if (!ticket) {
      return res.status(404).json({
        success: false,
        message: 'Tiket tidak ditemukan'
      });
    }

    // Buat balasan
    const reply = await prisma.customerServiceReply.create({
      data: {
        message,
        ticketId: id
      }
    });

    return res.status(201).json({
      success: true,
      message: 'Balasan berhasil ditambahkan',
      data: {
        reply: {
          id: reply.id,
          message: reply.message,
          createdAt: reply.createdAt
        }
      }
    });
  } catch (error) {
    console.error('Error replying to customer service ticket:', error);
    return res.status(500).json({
      success: false,
      message: 'Terjadi kesalahan server'
    });
  }
};

export const getCustomerServiceStatistics = async (req: Request, res: Response) => {
  try {
    // Verifikasi role dari token
    const userRole = (req as any).user.role;
    if (userRole !== 'SUPER_ADMIN' && userRole !== 'CUSTOMER_SERVICE') {
      return res.status(403).json({
        success: false,
        message: 'Anda tidak memiliki akses untuk melihat statistik customer service'
      });
    }

    const totalTickets = await prisma.customerServiceTicket.count();
    const openTickets = await prisma.customerServiceTicket.count({
      where: {
        status: 'OPEN'
      }
    });
    const inProgressTickets = await prisma.customerServiceTicket.count({
      where: {
        status: 'IN_PROGRESS'
      }
    });
    const resolvedTickets = await prisma.customerServiceTicket.count({
      where: {
        status: 'RESOLVED'
      }
    });
    const closedTickets = await prisma.customerServiceTicket.count({
      where: {
        status: 'CLOSED'
      }
    });

    return res.status(200).json({
      success: true,
      message: 'Data statistik customer service berhasil diambil',
      data: {
        statistics: {
          totalTickets,
          openTickets,
          inProgressTickets,
          resolvedTickets,
          closedTickets,
          averageResponseTime: '0h' // Implementasi perhitungan waktu respon rata-rata
        }
      }
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Terjadi kesalahan server'
    });
  }
};

export const getTechnicalIssues = async (req: Request, res: Response) => {
  try {
    // Verifikasi role dari token
    const userRole = (req as any).user.role;
    if (userRole !== AdminRole.ADMIN_TECHNICAL) {
      return res.status(403).json({
        success: false,
        message: 'Anda tidak memiliki akses untuk melihat masalah teknis'
      });
    }

    const issues = await prisma.technicalIssue.findMany({
      include: {
        resolutions: true
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    return res.status(200).json({
      success: true,
      message: 'Data masalah teknis berhasil diambil',
      data: issues
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Terjadi kesalahan server'
    });
  }
};

export const createCustomerServiceTicket = async (req: Request, res: Response) => {
  try {
    const { subject, message } = req.body;

    // Verifikasi role dari token
    const userRole = (req as any).user.role;
    if (userRole !== 'SUPER_ADMIN' && userRole !== 'CUSTOMER_SERVICE') {
      return res.status(403).json({
        success: false,
        message: 'Anda tidak memiliki akses untuk membuat tiket customer service'
      });
    }

    const ticket = await prisma.customerServiceTicket.create({
      data: {
        subject,
        message,
        status: 'OPEN',
        adminId: (req as any).user.id
      }
    });

    return res.status(201).json({
      success: true,
      message: 'Tiket customer service berhasil dibuat',
      data: {
        ticket: {
          id: ticket.id,
          status: ticket.status,
          subject: ticket.subject,
          message: ticket.message,
          createdAt: ticket.createdAt,
          adminId: ticket.adminId
        }
      }
    });
  } catch (error) {
    console.error('Error creating customer service ticket:', error);
    return res.status(500).json({
      success: false,
      message: 'Terjadi kesalahan server'
    });
  }
}; 
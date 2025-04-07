import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { AdminRole } from '../../models/user/admin.model';
import Joi from 'joi';

const prisma = new PrismaClient();

interface CustomRequest extends Request {
  user?: {
    id: string;
    email: string;
    role: string;
  };
}

// Middleware untuk memverifikasi role customer service
const verifyCustomerService = (req: CustomRequest, res: Response, next: Function) => {
  if (!req.user || req.user.role !== AdminRole.CUSTOMER_SERVICE) {
    return res.status(403).json({
      success: false,
      message: 'Anda tidak memiliki akses untuk melakukan operasi ini'
    });
  }
  next();
};

// Schema validasi untuk tiket
const ticketSchema = Joi.object({
  subject: Joi.string().required(),
  message: Joi.string().required()
});

// Schema validasi untuk balasan tiket
const replySchema = Joi.object({
  message: Joi.string().required()
});

// Schema validasi untuk update status tiket
const statusSchema = Joi.object({
  status: Joi.string().valid('open', 'in_progress', 'resolved', 'closed').required()
});

// Dapatkan semua tiket
export const getTickets = async (req: CustomRequest, res: Response) => {
  try {
    // Verifikasi role
    if (!req.user || req.user.role !== AdminRole.CUSTOMER_SERVICE) {
      return res.status(403).json({
        success: false,
        message: 'Anda tidak memiliki akses untuk melihat tiket'
      });
    }

    const tickets = await prisma.customerServiceTicket.findMany({
      include: {
        replies: true
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    return res.json({
      success: true,
      data: tickets
    });
  } catch (error) {
    console.error('Error getting tickets:', error);
    return res.status(500).json({
      success: false,
      message: 'Terjadi kesalahan server'
    });
  }
};

// Dapatkan tiket by ID
export const getTicketById = async (req: CustomRequest, res: Response) => {
  try {
    // Verifikasi role
    if (!req.user || req.user.role !== AdminRole.CUSTOMER_SERVICE) {
      return res.status(403).json({
        success: false,
        message: 'Anda tidak memiliki akses untuk melihat tiket'
      });
    }

    const { id } = req.params;
    const ticket = await prisma.customerServiceTicket.findUnique({
      where: { id },
      include: {
        replies: true
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
      data: ticket
    });
  } catch (error) {
    console.error('Error getting ticket:', error);
    return res.status(500).json({
      success: false,
      message: 'Terjadi kesalahan server'
    });
  }
};

// Update status tiket
export const updateTicketStatus = async (req: CustomRequest, res: Response) => {
  try {
    // Verifikasi role
    if (!req.user || req.user.role !== AdminRole.CUSTOMER_SERVICE) {
      return res.status(403).json({
        success: false,
        message: 'Anda tidak memiliki akses untuk mengupdate tiket'
      });
    }

    const { id } = req.params;
    const { error } = statusSchema.validate(req.body);
    if (error) {
      return res.status(400).json({
        success: false,
        message: error.details[0].message
      });
    }

    const ticket = await prisma.customerServiceTicket.update({
      where: { id },
      data: {
        status: req.body.status
      }
    });

    return res.json({
      success: true,
      message: 'Status tiket berhasil diupdate',
      data: ticket
    });
  } catch (error) {
    console.error('Error updating ticket status:', error);
    return res.status(500).json({
      success: false,
      message: 'Terjadi kesalahan server'
    });
  }
};

// Balas tiket
export const replyTicket = async (req: CustomRequest, res: Response) => {
  try {
    // Verifikasi role
    if (!req.user || req.user.role !== AdminRole.CUSTOMER_SERVICE) {
      return res.status(403).json({
        success: false,
        message: 'Anda tidak memiliki akses untuk membalas tiket'
      });
    }

    const { id } = req.params;
    const { error } = replySchema.validate(req.body);
    if (error) {
      return res.status(400).json({
        success: false,
        message: error.details[0].message
      });
    }

    const reply = await prisma.customerServiceReply.create({
      data: {
        message: req.body.message,
        ticketId: id
      }
    });

    return res.status(201).json({
      success: true,
      message: 'Balasan berhasil ditambahkan',
      data: reply
    });
  } catch (error) {
    console.error('Error replying ticket:', error);
    return res.status(500).json({
      success: false,
      message: 'Terjadi kesalahan server'
    });
  }
};

// Dapatkan statistik tiket
export const getTicketStatistics = async (req: CustomRequest, res: Response) => {
  try {
    // Verifikasi role
    if (!req.user || req.user.role !== AdminRole.CUSTOMER_SERVICE) {
      return res.status(403).json({
        success: false,
        message: 'Anda tidak memiliki akses untuk melihat statistik'
      });
    }

    const totalTickets = await prisma.customerServiceTicket.count();
    const openTickets = await prisma.customerServiceTicket.count({
      where: { status: 'open' }
    });
    const inProgressTickets = await prisma.customerServiceTicket.count({
      where: { status: 'in_progress' }
    });
    const resolvedTickets = await prisma.customerServiceTicket.count({
      where: { status: 'resolved' }
    });
    const closedTickets = await prisma.customerServiceTicket.count({
      where: { status: 'closed' }
    });

    return res.json({
      success: true,
      data: {
        total: totalTickets,
        open: openTickets,
        inProgress: inProgressTickets,
        resolved: resolvedTickets,
        closed: closedTickets
      }
    });
  } catch (error) {
    console.error('Error getting ticket statistics:', error);
    return res.status(500).json({
      success: false,
      message: 'Terjadi kesalahan server'
    });
  }
}; 
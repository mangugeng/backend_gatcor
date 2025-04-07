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

// Middleware untuk memverifikasi role admin technical
const verifyAdminTechnical = (req: CustomRequest, res: Response, next: Function) => {
  if (!req.user || req.user.role !== AdminRole.ADMIN_TECHNICAL) {
    return res.status(403).json({
      success: false,
      message: 'Anda tidak memiliki akses untuk melakukan operasi ini'
    });
  }
  next();
};

// Schema validasi untuk masalah teknis
const issueSchema = Joi.object({
  title: Joi.string().required(),
  description: Joi.string().required(),
  priority: Joi.string().valid('low', 'medium', 'high').required()
});

// Schema validasi untuk solusi
const resolutionSchema = Joi.object({
  solution: Joi.string().required()
});

// Schema validasi untuk update status
const statusSchema = Joi.object({
  status: Joi.string().valid('open', 'in_progress', 'resolved').required()
});

// Dapatkan semua masalah teknis
export const getIssues = async (req: CustomRequest, res: Response) => {
  try {
    // Verifikasi role
    if (!req.user || req.user.role !== AdminRole.ADMIN_TECHNICAL) {
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

    return res.json({
      success: true,
      data: issues
    });
  } catch (error) {
    console.error('Error getting issues:', error);
    return res.status(500).json({
      success: false,
      message: 'Terjadi kesalahan server'
    });
  }
};

// Dapatkan masalah teknis by ID
export const getIssueById = async (req: CustomRequest, res: Response) => {
  try {
    // Verifikasi role
    if (!req.user || req.user.role !== AdminRole.ADMIN_TECHNICAL) {
      return res.status(403).json({
        success: false,
        message: 'Anda tidak memiliki akses untuk melihat masalah teknis'
      });
    }

    const { id } = req.params;
    const issue = await prisma.technicalIssue.findUnique({
      where: { id },
      include: {
        resolutions: true
      }
    });

    if (!issue) {
      return res.status(404).json({
        success: false,
        message: 'Masalah teknis tidak ditemukan'
      });
    }

    return res.json({
      success: true,
      data: issue
    });
  } catch (error) {
    console.error('Error getting issue:', error);
    return res.status(500).json({
      success: false,
      message: 'Terjadi kesalahan server'
    });
  }
};

// Update status masalah teknis
export const updateIssueStatus = async (req: CustomRequest, res: Response) => {
  try {
    // Verifikasi role
    if (!req.user || req.user.role !== AdminRole.ADMIN_TECHNICAL) {
      return res.status(403).json({
        success: false,
        message: 'Anda tidak memiliki akses untuk mengupdate masalah teknis'
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

    const issue = await prisma.technicalIssue.update({
      where: { id },
      data: {
        status: req.body.status
      }
    });

    return res.json({
      success: true,
      message: 'Status masalah teknis berhasil diupdate',
      data: issue
    });
  } catch (error) {
    console.error('Error updating issue status:', error);
    return res.status(500).json({
      success: false,
      message: 'Terjadi kesalahan server'
    });
  }
};

// Tambahkan solusi
export const addResolution = async (req: CustomRequest, res: Response) => {
  try {
    // Verifikasi role
    if (!req.user || req.user.role !== AdminRole.ADMIN_TECHNICAL) {
      return res.status(403).json({
        success: false,
        message: 'Anda tidak memiliki akses untuk menambahkan solusi'
      });
    }

    const { id } = req.params;
    const { error } = resolutionSchema.validate(req.body);
    if (error) {
      return res.status(400).json({
        success: false,
        message: error.details[0].message
      });
    }

    const resolution = await prisma.technicalResolution.create({
      data: {
        solution: req.body.solution,
        issueId: id
      }
    });

    return res.status(201).json({
      success: true,
      message: 'Solusi berhasil ditambahkan',
      data: resolution
    });
  } catch (error) {
    console.error('Error adding resolution:', error);
    return res.status(500).json({
      success: false,
      message: 'Terjadi kesalahan server'
    });
  }
};

// Dapatkan statistik masalah teknis
export const getIssueStatistics = async (req: CustomRequest, res: Response) => {
  try {
    // Verifikasi role
    if (!req.user || req.user.role !== AdminRole.ADMIN_TECHNICAL) {
      return res.status(403).json({
        success: false,
        message: 'Anda tidak memiliki akses untuk melihat statistik'
      });
    }

    const totalIssues = await prisma.technicalIssue.count();
    const openIssues = await prisma.technicalIssue.count({
      where: { status: 'open' }
    });
    const inProgressIssues = await prisma.technicalIssue.count({
      where: { status: 'in_progress' }
    });
    const resolvedIssues = await prisma.technicalIssue.count({
      where: { status: 'resolved' }
    });

    return res.json({
      success: true,
      data: {
        total: totalIssues,
        open: openIssues,
        inProgress: inProgressIssues,
        resolved: resolvedIssues
      }
    });
  } catch (error) {
    console.error('Error getting issue statistics:', error);
    return res.status(500).json({
      success: false,
      message: 'Terjadi kesalahan server'
    });
  }
};

// Buat masalah teknis baru
export const createTechnicalIssue = async (req: CustomRequest, res: Response) => {
  try {
    // Verifikasi role
    if (!req.user || req.user.role !== AdminRole.ADMIN_TECHNICAL) {
      return res.status(403).json({
        success: false,
        message: 'Anda tidak memiliki akses untuk membuat masalah teknis'
      });
    }

    const { error } = issueSchema.validate(req.body);
    if (error) {
      return res.status(400).json({
        success: false,
        message: error.details[0].message
      });
    }

    const issue = await prisma.technicalIssue.create({
      data: {
        title: req.body.title,
        description: req.body.description,
        priority: req.body.priority,
        status: 'open'
      }
    });

    return res.status(201).json({
      success: true,
      message: 'Masalah teknis berhasil dibuat',
      data: issue
    });
  } catch (error) {
    console.error('Error creating issue:', error);
    return res.status(500).json({
      success: false,
      message: 'Terjadi kesalahan server'
    });
  }
}; 
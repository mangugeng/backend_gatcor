import { Request, Response } from 'express';
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

const contentSchema = Joi.object({
  title: Joi.string().required(),
  body: Joi.string().required(),
  category: Joi.string().required()
});

export const createContent = async (req: CustomRequest, res: Response) => {
  try {
    // Validasi input
    const { error } = contentSchema.validate(req.body);
    if (error) {
      return res.status(400).json({
        success: false,
        message: error.details[0].message
      });
    }

    const { title, body, category } = req.body;
    
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Unauthorized'
      });
    }

    // Cek apakah admin ada
    const admin = await prisma.admin.findUnique({
      where: { id: req.user.id }
    });

    if (!admin) {
      return res.status(404).json({
        success: false,
        message: 'Admin tidak ditemukan'
      });
    }

    const content = await prisma.content.create({
      data: {
        title,
        body,
        category,
        authorId: req.user.id,
        status: 'draft'
      },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      }
    });

    return res.status(201).json({
      success: true,
      message: 'Konten berhasil dibuat',
      data: content
    });
  } catch (error) {
    console.error('Error creating content:', error);
    return res.status(500).json({
      success: false,
      message: 'Terjadi kesalahan server'
    });
  }
};

export const getContents = async (req: Request, res: Response) => {
  try {
    const contents = await prisma.content.findMany({
      include: {
        author: true
      }
    });

    return res.status(200).json({
      success: true,
      message: 'Data konten berhasil diambil',
      data: { contents }
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Terjadi kesalahan server'
    });
  }
};

export const getContentById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const content = await prisma.content.findUnique({
      where: { id },
      include: {
        author: true
      }
    });

    if (!content) {
      return res.status(404).json({
        success: false,
        message: 'Konten tidak ditemukan'
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Data konten berhasil diambil',
      data: { content }
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Terjadi kesalahan server'
    });
  }
};

export const updateContent = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { title, body, category, status } = req.body;

    const content = await prisma.content.update({
      where: { id },
      data: {
        title,
        body,
        category,
        status
      },
      include: {
        author: true
      }
    });

    return res.status(200).json({
      success: true,
      message: 'Konten berhasil diperbarui',
      data: { content }
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Terjadi kesalahan server'
    });
  }
};

export const deleteContent = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await prisma.content.delete({
      where: { id }
    });

    return res.status(200).json({
      success: true,
      message: 'Konten berhasil dihapus'
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Terjadi kesalahan server'
    });
  }
}; 
import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const createTemplate = async (req: Request, res: Response) => {
  try {
    const { name, description, content, category } = req.body;

    const template = await prisma.template.create({
      data: {
        name,
        description,
        content,
        category
      }
    });

    return res.status(201).json({
      success: true,
      message: 'Template berhasil dibuat',
      data: { template }
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Terjadi kesalahan server'
    });
  }
};

export const getTemplates = async (req: Request, res: Response) => {
  try {
    const templates = await prisma.template.findMany();

    return res.status(200).json({
      success: true,
      message: 'Data template berhasil diambil',
      data: { templates }
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Terjadi kesalahan server'
    });
  }
};

export const getTemplateById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const template = await prisma.template.findUnique({
      where: { id }
    });

    if (!template) {
      return res.status(404).json({
        success: false,
        message: 'Template tidak ditemukan'
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Data template berhasil diambil',
      data: { template }
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Terjadi kesalahan server'
    });
  }
};

export const updateTemplate = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { name, description, content, category, status } = req.body;

    const template = await prisma.template.update({
      where: { id },
      data: {
        name,
        description,
        content,
        category,
        status
      }
    });

    return res.status(200).json({
      success: true,
      message: 'Template berhasil diperbarui',
      data: { template }
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Terjadi kesalahan server'
    });
  }
};

export const deleteTemplate = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await prisma.template.delete({
      where: { id }
    });

    return res.status(200).json({
      success: true,
      message: 'Template berhasil dihapus'
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Terjadi kesalahan server'
    });
  }
}; 
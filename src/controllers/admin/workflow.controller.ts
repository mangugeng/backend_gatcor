import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const createWorkflow = async (req: Request, res: Response) => {
  try {
    const { name, description, steps } = req.body;

    const workflow = await prisma.workflow.create({
      data: {
        name,
        description,
        steps
      }
    });

    return res.status(201).json({
      success: true,
      message: 'Workflow berhasil dibuat',
      data: { workflow }
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Terjadi kesalahan server'
    });
  }
};

export const getWorkflows = async (req: Request, res: Response) => {
  try {
    const workflows = await prisma.workflow.findMany();

    return res.status(200).json({
      success: true,
      message: 'Data workflow berhasil diambil',
      data: { workflows }
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Terjadi kesalahan server'
    });
  }
};

export const getWorkflowById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const workflow = await prisma.workflow.findUnique({
      where: { id }
    });

    if (!workflow) {
      return res.status(404).json({
        success: false,
        message: 'Workflow tidak ditemukan'
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Data workflow berhasil diambil',
      data: { workflow }
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Terjadi kesalahan server'
    });
  }
};

export const updateWorkflow = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { name, description, steps, status } = req.body;

    const workflow = await prisma.workflow.update({
      where: { id },
      data: {
        name,
        description,
        steps,
        status
      }
    });

    return res.status(200).json({
      success: true,
      message: 'Workflow berhasil diperbarui',
      data: { workflow }
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Terjadi kesalahan server'
    });
  }
};

export const deleteWorkflow = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await prisma.workflow.delete({
      where: { id }
    });

    return res.status(200).json({
      success: true,
      message: 'Workflow berhasil dihapus'
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Terjadi kesalahan server'
    });
  }
}; 
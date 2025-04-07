import { Request, Response } from 'express';

export const createPromotion = async (req: Request, res: Response) => {
  try {
    return res.status(201).json({
      success: true,
      message: 'Promosi berhasil dibuat',
      data: req.body
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Terjadi kesalahan server'
    });
  }
};

export const getAllPromotions = async (req: Request, res: Response) => {
  try {
    return res.status(200).json({
      success: true,
      message: 'Daftar promosi berhasil diambil',
      data: []
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Terjadi kesalahan server'
    });
  }
};

export const getPromotionById = async (req: Request, res: Response) => {
  try {
    return res.status(200).json({
      success: true,
      message: 'Data promosi berhasil diambil',
      data: { id: req.params.id }
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Terjadi kesalahan server'
    });
  }
};

export const updatePromotion = async (req: Request, res: Response) => {
  try {
    return res.status(200).json({
      success: true,
      message: 'Promosi berhasil diperbarui',
      data: { id: req.params.id, ...req.body }
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Terjadi kesalahan server'
    });
  }
};

export const deletePromotion = async (req: Request, res: Response) => {
  try {
    return res.status(200).json({
      success: true,
      message: 'Promosi berhasil dihapus',
      data: { id: req.params.id }
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Terjadi kesalahan server'
    });
  }
};

export const activatePromotion = async (req: Request, res: Response) => {
  try {
    return res.status(200).json({
      success: true,
      message: 'Promosi berhasil diaktifkan',
      data: { id: req.params.id }
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Terjadi kesalahan server'
    });
  }
};

export const deactivatePromotion = async (req: Request, res: Response) => {
  try {
    return res.status(200).json({
      success: true,
      message: 'Promosi berhasil dinonaktifkan',
      data: { id: req.params.id }
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Terjadi kesalahan server'
    });
  }
}; 
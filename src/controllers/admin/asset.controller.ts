import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import multer from 'multer';
import path from 'path';
import fs from 'fs';

const prisma = new PrismaClient();

// Konfigurasi multer untuk upload file
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = 'public/uploads';
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

export const upload = multer({ storage });

export const uploadAsset = async (req: Request, res: Response) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'File tidak ditemukan'
      });
    }

    const { originalname, mimetype, filename, size } = req.file;
    const type = mimetype.split('/')[0];
    const url = `/uploads/${filename}`;

    const asset = await prisma.asset.create({
      data: {
        name: originalname,
        type,
        url,
        metadata: {
          size,
          mimeType: mimetype
        }
      }
    });

    return res.status(201).json({
      success: true,
      message: 'Asset berhasil diupload',
      data: { asset }
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Terjadi kesalahan server'
    });
  }
};

export const getAssets = async (req: Request, res: Response) => {
  try {
    const assets = await prisma.asset.findMany();

    return res.status(200).json({
      success: true,
      message: 'Data asset berhasil diambil',
      data: { assets }
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Terjadi kesalahan server'
    });
  }
};

export const getAssetById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const asset = await prisma.asset.findUnique({
      where: { id }
    });

    if (!asset) {
      return res.status(404).json({
        success: false,
        message: 'Asset tidak ditemukan'
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Data asset berhasil diambil',
      data: { asset }
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Terjadi kesalahan server'
    });
  }
};

export const updateAsset = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { name, status } = req.body;

    const asset = await prisma.asset.update({
      where: { id },
      data: {
        name,
        status
      }
    });

    return res.status(200).json({
      success: true,
      message: 'Asset berhasil diperbarui',
      data: { asset }
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Terjadi kesalahan server'
    });
  }
};

export const deleteAsset = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const asset = await prisma.asset.findUnique({
      where: { id }
    });

    if (!asset) {
      return res.status(404).json({
        success: false,
        message: 'Asset tidak ditemukan'
      });
    }

    // Hapus file fisik
    const filePath = path.join(process.cwd(), 'public', asset.url);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    // Hapus data dari database
    await prisma.asset.delete({
      where: { id }
    });

    return res.status(200).json({
      success: true,
      message: 'Asset berhasil dihapus'
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Terjadi kesalahan server'
    });
  }
}; 
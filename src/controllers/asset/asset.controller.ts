import { Request, Response } from 'express';
import { AssetService } from '../../services/asset.service';

const assetService = new AssetService();

export const uploadAsset = async (req: Request, res: Response) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'File tidak ditemukan'
      });
    }

    const result = await assetService.uploadAsset(req.file, req.body);
    return res.status(result.success ? 201 : 400).json(result);
  } catch (error) {
    console.error('Error in uploadAsset controller:', error);
    return res.status(500).json({
      success: false,
      message: 'Terjadi kesalahan saat mengupload asset',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

export const getAssetById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const result = await assetService.getAssetById(id);
    return res.status(result.success ? 200 : 404).json(result);
  } catch (error) {
    console.error('Error in getAssetById controller:', error);
    return res.status(500).json({
      success: false,
      message: 'Terjadi kesalahan saat mendapatkan asset',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

export const deleteAsset = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const result = await assetService.deleteAsset(id);
    return res.status(result.success ? 200 : 404).json(result);
  } catch (error) {
    console.error('Error in deleteAsset controller:', error);
    return res.status(500).json({
      success: false,
      message: 'Terjadi kesalahan saat menghapus asset',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

export const getAllAssets = async (req: Request, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    
    const result = await assetService.getAllAssets(page, limit);
    return res.status(200).json(result);
  } catch (error) {
    console.error('Error in getAllAssets controller:', error);
    return res.status(500).json({
      success: false,
      message: 'Terjadi kesalahan saat mendapatkan daftar asset',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

export const updateAsset = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const result = await assetService.updateAsset(id, req.body);
    return res.status(result.success ? 200 : 404).json(result);
  } catch (error) {
    console.error('Error in updateAsset controller:', error);
    return res.status(500).json({
      success: false,
      message: 'Terjadi kesalahan saat mengupdate asset',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

export const processAsset = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { processType } = req.body;
    
    if (!processType) {
      return res.status(400).json({
        success: false,
        message: 'Tipe proses harus diisi'
      });
    }

    const result = await assetService.processAsset(id, processType);
    return res.status(result.success ? 200 : 404).json(result);
  } catch (error) {
    console.error('Error in processAsset controller:', error);
    return res.status(500).json({
      success: false,
      message: 'Terjadi kesalahan saat memproses asset',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

export const getAssetUrl = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const expiresIn = parseInt(req.query.expiresIn as string) || 3600;
    
    const result = await assetService.getAssetUrl(id, expiresIn);
    return res.status(result.success ? 200 : 404).json(result);
  } catch (error) {
    console.error('Error in getAssetUrl controller:', error);
    return res.status(500).json({
      success: false,
      message: 'Terjadi kesalahan saat mendapatkan URL asset',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}; 
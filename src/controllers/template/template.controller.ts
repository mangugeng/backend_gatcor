import { Request, Response } from 'express';
import { TemplateService } from '../../services/template.service';

const templateService = new TemplateService();

// Template Controllers
export const getAllTemplates = async (req: Request, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const categoryId = req.query.categoryId as string;
    const type = req.query.type as string;
    const search = req.query.search as string;

    const result = await templateService.getAllTemplates(page, limit, {
      categoryId,
      type,
      search
    });

    return res.status(200).json(result);
  } catch (error) {
    console.error('Error in getAllTemplates controller:', error);
    return res.status(500).json({
      success: false,
      message: 'Terjadi kesalahan saat mendapatkan daftar template',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

export const getTemplateById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const result = await templateService.getTemplateById(id);
    return res.status(result.success ? 200 : 404).json(result);
  } catch (error) {
    console.error('Error in getTemplateById controller:', error);
    return res.status(500).json({
      success: false,
      message: 'Terjadi kesalahan saat mendapatkan template',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

export const createTemplate = async (req: Request, res: Response) => {
  try {
    const { name, description, categoryId, content, type, metadata } = req.body;

    if (!name || !description || !categoryId || !content || !type) {
      return res.status(400).json({
        success: false,
        message: 'Semua field wajib diisi'
      });
    }

    const result = await templateService.createTemplate({
      name,
      description,
      categoryId,
      content,
      type,
      metadata
    });

    return res.status(result.success ? 201 : 400).json(result);
  } catch (error) {
    console.error('Error in createTemplate controller:', error);
    return res.status(500).json({
      success: false,
      message: 'Terjadi kesalahan saat membuat template',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

export const updateTemplate = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const result = await templateService.updateTemplate(id, req.body);
    return res.status(result.success ? 200 : 404).json(result);
  } catch (error) {
    console.error('Error in updateTemplate controller:', error);
    return res.status(500).json({
      success: false,
      message: 'Terjadi kesalahan saat mengupdate template',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

export const deleteTemplate = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const result = await templateService.deleteTemplate(id);
    return res.status(result.success ? 200 : 404).json(result);
  } catch (error) {
    console.error('Error in deleteTemplate controller:', error);
    return res.status(500).json({
      success: false,
      message: 'Terjadi kesalahan saat menghapus template',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

export const useTemplate = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const result = await templateService.useTemplate(id, req.body);
    return res.status(result.success ? 200 : 404).json(result);
  } catch (error) {
    console.error('Error in useTemplate controller:', error);
    return res.status(500).json({
      success: false,
      message: 'Terjadi kesalahan saat menggunakan template',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

// Template Category Controllers
export const getAllTemplateCategories = async (req: Request, res: Response) => {
  try {
    // Implementasi logika mendapatkan semua kategori template
    res.status(200).json({ message: 'Berhasil mendapatkan semua kategori template' });
  } catch (error) {
    res.status(500).json({ message: 'Terjadi kesalahan server' });
  }
};

export const createTemplateCategory = async (req: Request, res: Response) => {
  try {
    // Implementasi logika pembuatan kategori template
    res.status(201).json({ message: 'Kategori template berhasil dibuat' });
  } catch (error) {
    res.status(500).json({ message: 'Terjadi kesalahan server' });
  }
};

export const updateTemplateCategory = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    // Implementasi logika update kategori template
    res.status(200).json({ message: `Berhasil update kategori template dengan ID ${id}` });
  } catch (error) {
    res.status(500).json({ message: 'Terjadi kesalahan server' });
  }
};

export const deleteTemplateCategory = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    // Implementasi logika delete kategori template
    res.status(200).json({ message: `Berhasil menghapus kategori template dengan ID ${id}` });
  } catch (error) {
    res.status(500).json({ message: 'Terjadi kesalahan server' });
  }
};

export const createCategory = async (req: Request, res: Response) => {
  try {
    const { name, description } = req.body;

    if (!name || !description) {
      return res.status(400).json({
        success: false,
        message: 'Nama dan deskripsi wajib diisi'
      });
    }

    const result = await templateService.createCategory({
      name,
      description
    });

    return res.status(result.success ? 201 : 400).json(result);
  } catch (error) {
    console.error('Error in createCategory controller:', error);
    return res.status(500).json({
      success: false,
      message: 'Terjadi kesalahan saat membuat kategori',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

export const updateCategory = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const result = await templateService.updateCategory(id, req.body);
    return res.status(result.success ? 200 : 404).json(result);
  } catch (error) {
    console.error('Error in updateCategory controller:', error);
    return res.status(500).json({
      success: false,
      message: 'Terjadi kesalahan saat mengupdate kategori',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

export const deleteCategory = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const result = await templateService.deleteCategory(id);
    return res.status(result.success ? 200 : 404).json(result);
  } catch (error) {
    console.error('Error in deleteCategory controller:', error);
    return res.status(500).json({
      success: false,
      message: 'Terjadi kesalahan saat menghapus kategori',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

export const getAllCategories = async (req: Request, res: Response) => {
  try {
    const result = await templateService.getAllCategories();
    return res.status(200).json(result);
  } catch (error) {
    console.error('Error in getAllCategories controller:', error);
    return res.status(500).json({
      success: false,
      message: 'Terjadi kesalahan saat mendapatkan daftar kategori',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}; 
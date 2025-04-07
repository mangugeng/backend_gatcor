import { Request, Response } from 'express';
import { CatalogService } from '../../services/catalog.service';

const catalogService = new CatalogService();

// Catalog Item Controllers
export const getAllCatalogItems = async (req: Request, res: Response) => {
  try {
    // Implementasi logika mendapatkan semua catalog item
    res.status(200).json({ message: 'Berhasil mendapatkan semua catalog item' });
  } catch (error) {
    res.status(500).json({ message: 'Terjadi kesalahan server' });
  }
};

export const getCatalogItemById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    // Implementasi logika mendapatkan catalog item by ID
    res.status(200).json({ message: `Berhasil mendapatkan catalog item dengan ID ${id}` });
  } catch (error) {
    res.status(500).json({ message: 'Terjadi kesalahan server' });
  }
};

export const createCatalogItem = async (req: Request, res: Response) => {
  try {
    // Implementasi logika pembuatan catalog item
    res.status(201).json({ message: 'Catalog item berhasil dibuat' });
  } catch (error) {
    res.status(500).json({ message: 'Terjadi kesalahan server' });
  }
};

export const updateCatalogItem = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    // Implementasi logika update catalog item
    res.status(200).json({ message: `Berhasil update catalog item dengan ID ${id}` });
  } catch (error) {
    res.status(500).json({ message: 'Terjadi kesalahan server' });
  }
};

export const deleteCatalogItem = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    // Implementasi logika delete catalog item
    res.status(200).json({ message: `Berhasil menghapus catalog item dengan ID ${id}` });
  } catch (error) {
    res.status(500).json({ message: 'Terjadi kesalahan server' });
  }
};

// Catalog Category Controllers
export const getAllCatalogCategories = async (req: Request, res: Response) => {
  try {
    // Implementasi logika mendapatkan semua kategori catalog
    res.status(200).json({ message: 'Berhasil mendapatkan semua kategori catalog' });
  } catch (error) {
    res.status(500).json({ message: 'Terjadi kesalahan server' });
  }
};

export const createCatalogCategory = async (req: Request, res: Response) => {
  try {
    // Implementasi logika pembuatan kategori catalog
    res.status(201).json({ message: 'Kategori catalog berhasil dibuat' });
  } catch (error) {
    res.status(500).json({ message: 'Terjadi kesalahan server' });
  }
};

export const updateCatalogCategory = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    // Implementasi logika update kategori catalog
    res.status(200).json({ message: `Berhasil update kategori catalog dengan ID ${id}` });
  } catch (error) {
    res.status(500).json({ message: 'Terjadi kesalahan server' });
  }
};

export const deleteCatalogCategory = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    // Implementasi logika delete kategori catalog
    res.status(200).json({ message: `Berhasil menghapus kategori catalog dengan ID ${id}` });
  } catch (error) {
    res.status(500).json({ message: 'Terjadi kesalahan server' });
  }
};

export const createCatalog = async (req: Request, res: Response) => {
  try {
    const { name, description, categoryId, price, stock, images, metadata } = req.body;

    if (!name || !description || !categoryId || !price || !stock || !images) {
      return res.status(400).json({
        success: false,
        message: 'Semua field wajib diisi'
      });
    }

    const result = await catalogService.createCatalog({
      name,
      description,
      categoryId,
      price,
      stock,
      images,
      metadata
    });

    return res.status(result.success ? 201 : 400).json(result);
  } catch (error) {
    console.error('Error in createCatalog controller:', error);
    return res.status(500).json({
      success: false,
      message: 'Terjadi kesalahan saat membuat katalog',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

export const getCatalogById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const result = await catalogService.getCatalogById(id);
    return res.status(result.success ? 200 : 404).json(result);
  } catch (error) {
    console.error('Error in getCatalogById controller:', error);
    return res.status(500).json({
      success: false,
      message: 'Terjadi kesalahan saat mendapatkan katalog',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

export const updateCatalog = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const result = await catalogService.updateCatalog(id, req.body);
    return res.status(result.success ? 200 : 404).json(result);
  } catch (error) {
    console.error('Error in updateCatalog controller:', error);
    return res.status(500).json({
      success: false,
      message: 'Terjadi kesalahan saat mengupdate katalog',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

export const deleteCatalog = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const result = await catalogService.deleteCatalog(id);
    return res.status(result.success ? 200 : 404).json(result);
  } catch (error) {
    console.error('Error in deleteCatalog controller:', error);
    return res.status(500).json({
      success: false,
      message: 'Terjadi kesalahan saat menghapus katalog',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

export const getAllCatalogs = async (req: Request, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const categoryId = req.query.categoryId as string;
    const minPrice = parseFloat(req.query.minPrice as string);
    const maxPrice = parseFloat(req.query.maxPrice as string);
    const search = req.query.search as string;

    const result = await catalogService.getAllCatalogs(page, limit, {
      categoryId,
      minPrice,
      maxPrice,
      search
    });

    return res.status(200).json(result);
  } catch (error) {
    console.error('Error in getAllCatalogs controller:', error);
    return res.status(500).json({
      success: false,
      message: 'Terjadi kesalahan saat mendapatkan daftar katalog',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

export const createCategory = async (req: Request, res: Response) => {
  try {
    const { name, description, parentId } = req.body;

    if (!name || !description) {
      return res.status(400).json({
        success: false,
        message: 'Nama dan deskripsi wajib diisi'
      });
    }

    const result = await catalogService.createCategory({
      name,
      description,
      parentId
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

export const getCategoryById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const result = await catalogService.getCategoryById(id);
    return res.status(result.success ? 200 : 404).json(result);
  } catch (error) {
    console.error('Error in getCategoryById controller:', error);
    return res.status(500).json({
      success: false,
      message: 'Terjadi kesalahan saat mendapatkan kategori',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

export const updateCategory = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const result = await catalogService.updateCategory(id, req.body);
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
    const result = await catalogService.deleteCategory(id);
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
    const result = await catalogService.getAllCategories();
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
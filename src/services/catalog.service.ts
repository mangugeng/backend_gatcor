import { PrismaClient } from '@prisma/client';
import { Response } from '../types/response';

const prisma = new PrismaClient();

export class CatalogService {
  async createCatalog(data: {
    name: string;
    description: string;
    categoryId: string;
    price: number;
    stock: number;
    images: string[];
    metadata?: any;
  }): Promise<Response> {
    try {
      const catalog = await prisma.catalog.create({
        data: {
          name: data.name,
          description: data.description,
          categoryId: data.categoryId,
          price: data.price,
          stock: data.stock,
          images: data.images,
          metadata: data.metadata
        }
      });

      return {
        success: true,
        message: 'Katalog berhasil dibuat',
        data: catalog
      };
    } catch (error) {
      console.error('Error creating catalog:', error);
      return {
        success: false,
        message: 'Gagal membuat katalog',
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  async getCatalogById(id: string): Promise<Response> {
    try {
      const catalog = await prisma.catalog.findUnique({
        where: { id },
        include: {
          category: true
        }
      });

      if (!catalog) {
        return {
          success: false,
          message: 'Katalog tidak ditemukan'
        };
      }

      return {
        success: true,
        message: 'Katalog berhasil ditemukan',
        data: catalog
      };
    } catch (error) {
      console.error('Error getting catalog:', error);
      return {
        success: false,
        message: 'Gagal mendapatkan katalog',
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  async updateCatalog(id: string, data: {
    name?: string;
    description?: string;
    categoryId?: string;
    price?: number;
    stock?: number;
    images?: string[];
    metadata?: any;
  }): Promise<Response> {
    try {
      const catalog = await prisma.catalog.findUnique({
        where: { id }
      });

      if (!catalog) {
        return {
          success: false,
          message: 'Katalog tidak ditemukan'
        };
      }

      const updatedCatalog = await prisma.catalog.update({
        where: { id },
        data
      });

      return {
        success: true,
        message: 'Katalog berhasil diupdate',
        data: updatedCatalog
      };
    } catch (error) {
      console.error('Error updating catalog:', error);
      return {
        success: false,
        message: 'Gagal mengupdate katalog',
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  async deleteCatalog(id: string): Promise<Response> {
    try {
      const catalog = await prisma.catalog.findUnique({
        where: { id }
      });

      if (!catalog) {
        return {
          success: false,
          message: 'Katalog tidak ditemukan'
        };
      }

      await prisma.catalog.delete({
        where: { id }
      });

      return {
        success: true,
        message: 'Katalog berhasil dihapus'
      };
    } catch (error) {
      console.error('Error deleting catalog:', error);
      return {
        success: false,
        message: 'Gagal menghapus katalog',
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  async getAllCatalogs(page: number = 1, limit: number = 10, filters?: {
    categoryId?: string;
    minPrice?: number;
    maxPrice?: number;
    search?: string;
  }): Promise<Response> {
    try {
      const skip = (page - 1) * limit;
      
      const where = {
        ...(filters?.categoryId && { categoryId: filters.categoryId }),
        ...(filters?.minPrice && { price: { gte: filters.minPrice } }),
        ...(filters?.maxPrice && { price: { lte: filters.maxPrice } }),
        ...(filters?.search && {
          OR: [
            { name: { contains: filters.search, mode: 'insensitive' } },
            { description: { contains: filters.search, mode: 'insensitive' } }
          ]
        })
      };

      const [catalogs, total] = await Promise.all([
        prisma.catalog.findMany({
          where,
          skip,
          take: limit,
          include: {
            category: true
          },
          orderBy: { createdAt: 'desc' }
        }),
        prisma.catalog.count({ where })
      ]);

      return {
        success: true,
        message: 'Daftar katalog berhasil didapatkan',
        data: {
          catalogs,
          pagination: {
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit)
          }
        }
      };
    } catch (error) {
      console.error('Error getting catalogs:', error);
      return {
        success: false,
        message: 'Gagal mendapatkan daftar katalog',
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  async createCategory(data: {
    name: string;
    description: string;
    parentId?: string;
  }): Promise<Response> {
    try {
      const category = await prisma.catalogCategory.create({
        data: {
          name: data.name,
          description: data.description,
          parentId: data.parentId
        }
      });

      return {
        success: true,
        message: 'Kategori berhasil dibuat',
        data: category
      };
    } catch (error) {
      console.error('Error creating category:', error);
      return {
        success: false,
        message: 'Gagal membuat kategori',
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  async getCategoryById(id: string): Promise<Response> {
    try {
      const category = await prisma.catalogCategory.findUnique({
        where: { id },
        include: {
          parent: true,
          children: true
        }
      });

      if (!category) {
        return {
          success: false,
          message: 'Kategori tidak ditemukan'
        };
      }

      return {
        success: true,
        message: 'Kategori berhasil ditemukan',
        data: category
      };
    } catch (error) {
      console.error('Error getting category:', error);
      return {
        success: false,
        message: 'Gagal mendapatkan kategori',
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  async updateCategory(id: string, data: {
    name?: string;
    description?: string;
    parentId?: string;
  }): Promise<Response> {
    try {
      const category = await prisma.catalogCategory.findUnique({
        where: { id }
      });

      if (!category) {
        return {
          success: false,
          message: 'Kategori tidak ditemukan'
        };
      }

      const updatedCategory = await prisma.catalogCategory.update({
        where: { id },
        data
      });

      return {
        success: true,
        message: 'Kategori berhasil diupdate',
        data: updatedCategory
      };
    } catch (error) {
      console.error('Error updating category:', error);
      return {
        success: false,
        message: 'Gagal mengupdate kategori',
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  async deleteCategory(id: string): Promise<Response> {
    try {
      const category = await prisma.catalogCategory.findUnique({
        where: { id }
      });

      if (!category) {
        return {
          success: false,
          message: 'Kategori tidak ditemukan'
        };
      }

      await prisma.catalogCategory.delete({
        where: { id }
      });

      return {
        success: true,
        message: 'Kategori berhasil dihapus'
      };
    } catch (error) {
      console.error('Error deleting category:', error);
      return {
        success: false,
        message: 'Gagal menghapus kategori',
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  async getAllCategories(): Promise<Response> {
    try {
      const categories = await prisma.catalogCategory.findMany({
        include: {
          parent: true,
          children: true
        }
      });

      return {
        success: true,
        message: 'Daftar kategori berhasil didapatkan',
        data: categories
      };
    } catch (error) {
      console.error('Error getting categories:', error);
      return {
        success: false,
        message: 'Gagal mendapatkan daftar kategori',
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }
} 
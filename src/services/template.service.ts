import { PrismaClient } from '@prisma/client';
import { Response } from '../types/response';

const prisma = new PrismaClient();

export class TemplateService {
  async createTemplate(data: {
    name: string;
    description: string;
    categoryId: string;
    content: string;
    type: string;
    metadata?: any;
  }): Promise<Response> {
    try {
      const template = await prisma.template.create({
        data: {
          name: data.name,
          description: data.description,
          categoryId: data.categoryId,
          content: data.content,
          type: data.type,
          metadata: data.metadata
        }
      });

      return {
        success: true,
        message: 'Template berhasil dibuat',
        data: template
      };
    } catch (error) {
      console.error('Error creating template:', error);
      return {
        success: false,
        message: 'Gagal membuat template',
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  async getTemplateById(id: string): Promise<Response> {
    try {
      const template = await prisma.template.findUnique({
        where: { id },
        include: {
          category: true
        }
      });

      if (!template) {
        return {
          success: false,
          message: 'Template tidak ditemukan'
        };
      }

      return {
        success: true,
        message: 'Template berhasil ditemukan',
        data: template
      };
    } catch (error) {
      console.error('Error getting template:', error);
      return {
        success: false,
        message: 'Gagal mendapatkan template',
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  async updateTemplate(id: string, data: {
    name?: string;
    description?: string;
    categoryId?: string;
    content?: string;
    type?: string;
    metadata?: any;
  }): Promise<Response> {
    try {
      const template = await prisma.template.findUnique({
        where: { id }
      });

      if (!template) {
        return {
          success: false,
          message: 'Template tidak ditemukan'
        };
      }

      const updatedTemplate = await prisma.template.update({
        where: { id },
        data
      });

      return {
        success: true,
        message: 'Template berhasil diupdate',
        data: updatedTemplate
      };
    } catch (error) {
      console.error('Error updating template:', error);
      return {
        success: false,
        message: 'Gagal mengupdate template',
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  async deleteTemplate(id: string): Promise<Response> {
    try {
      const template = await prisma.template.findUnique({
        where: { id }
      });

      if (!template) {
        return {
          success: false,
          message: 'Template tidak ditemukan'
        };
      }

      await prisma.template.delete({
        where: { id }
      });

      return {
        success: true,
        message: 'Template berhasil dihapus'
      };
    } catch (error) {
      console.error('Error deleting template:', error);
      return {
        success: false,
        message: 'Gagal menghapus template',
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  async getAllTemplates(page: number = 1, limit: number = 10, filters?: {
    categoryId?: string;
    type?: string;
    search?: string;
  }): Promise<Response> {
    try {
      const skip = (page - 1) * limit;
      
      const where = {
        ...(filters?.categoryId && { categoryId: filters.categoryId }),
        ...(filters?.type && { type: filters.type }),
        ...(filters?.search && {
          OR: [
            { name: { contains: filters.search, mode: 'insensitive' } },
            { description: { contains: filters.search, mode: 'insensitive' } }
          ]
        })
      };

      const [templates, total] = await Promise.all([
        prisma.template.findMany({
          where,
          skip,
          take: limit,
          include: {
            category: true
          },
          orderBy: { createdAt: 'desc' }
        }),
        prisma.template.count({ where })
      ]);

      return {
        success: true,
        message: 'Daftar template berhasil didapatkan',
        data: {
          templates,
          pagination: {
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit)
          }
        }
      };
    } catch (error) {
      console.error('Error getting templates:', error);
      return {
        success: false,
        message: 'Gagal mendapatkan daftar template',
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  async useTemplate(id: string, data: any): Promise<Response> {
    try {
      const template = await prisma.template.findUnique({
        where: { id }
      });

      if (!template) {
        return {
          success: false,
          message: 'Template tidak ditemukan'
        };
      }

      // Implementasi logika penggunaan template
      // Contoh: menghasilkan konten berdasarkan template dan data
      const generatedContent = this.generateContent(template.content, data);

      return {
        success: true,
        message: 'Template berhasil digunakan',
        data: {
          templateId: id,
          generatedContent
        }
      };
    } catch (error) {
      console.error('Error using template:', error);
      return {
        success: false,
        message: 'Gagal menggunakan template',
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  private generateContent(templateContent: string, data: any): string {
    // Implementasi sederhana untuk mengganti placeholder dengan data
    let content = templateContent;
    for (const [key, value] of Object.entries(data)) {
      content = content.replace(new RegExp(`{{${key}}}`, 'g'), String(value));
    }
    return content;
  }

  async createCategory(data: {
    name: string;
    description: string;
  }): Promise<Response> {
    try {
      const category = await prisma.templateCategory.create({
        data: {
          name: data.name,
          description: data.description
        }
      });

      return {
        success: true,
        message: 'Kategori template berhasil dibuat',
        data: category
      };
    } catch (error) {
      console.error('Error creating template category:', error);
      return {
        success: false,
        message: 'Gagal membuat kategori template',
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  async updateCategory(id: string, data: {
    name?: string;
    description?: string;
  }): Promise<Response> {
    try {
      const category = await prisma.templateCategory.findUnique({
        where: { id }
      });

      if (!category) {
        return {
          success: false,
          message: 'Kategori template tidak ditemukan'
        };
      }

      const updatedCategory = await prisma.templateCategory.update({
        where: { id },
        data
      });

      return {
        success: true,
        message: 'Kategori template berhasil diupdate',
        data: updatedCategory
      };
    } catch (error) {
      console.error('Error updating template category:', error);
      return {
        success: false,
        message: 'Gagal mengupdate kategori template',
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  async deleteCategory(id: string): Promise<Response> {
    try {
      const category = await prisma.templateCategory.findUnique({
        where: { id }
      });

      if (!category) {
        return {
          success: false,
          message: 'Kategori template tidak ditemukan'
        };
      }

      await prisma.templateCategory.delete({
        where: { id }
      });

      return {
        success: true,
        message: 'Kategori template berhasil dihapus'
      };
    } catch (error) {
      console.error('Error deleting template category:', error);
      return {
        success: false,
        message: 'Gagal menghapus kategori template',
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  async getAllCategories(): Promise<Response> {
    try {
      const categories = await prisma.templateCategory.findMany({
        include: {
          templates: true
        }
      });

      return {
        success: true,
        message: 'Daftar kategori template berhasil didapatkan',
        data: categories
      };
    } catch (error) {
      console.error('Error getting template categories:', error);
      return {
        success: false,
        message: 'Gagal mendapatkan daftar kategori template',
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }
} 
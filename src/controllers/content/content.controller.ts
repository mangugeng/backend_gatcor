import { Request, Response } from 'express';
import { ContentService } from '../../services/content.service';

const contentService = new ContentService();

// Content Controllers
export const getAllContent = async (req: Request, res: Response) => {
  try {
    const contents = await contentService.getAllContent();

    return res.status(200).json({
      success: true,
      message: 'Contents retrieved successfully',
      data: contents
    });
  } catch (error) {
    console.error('Error in getAllContent controller:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to get contents',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

export const getContentById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    
    const content = await contentService.getContentById(id);

    return res.status(200).json({
      success: true,
      message: 'Content retrieved successfully',
      data: content
    });
  } catch (error) {
    console.error('Error in getContentById controller:', error);
    if (error instanceof Error && error.message === 'Content not found') {
      return res.status(404).json({
        success: false,
        message: 'Content not found'
      });
    }
    return res.status(500).json({
      success: false,
      message: 'Failed to get content',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

export const createContent = async (req: Request, res: Response) => {
  try {
    const { title, description, body, categoryId, authorId, status, tags } = req.body;
    
    if (!title || !description || !body || !categoryId || !authorId) {
      return res.status(400).json({
        success: false,
        message: 'Title, description, body, categoryId, and authorId are required'
      });
    }

    const content = await contentService.createContent({
      title,
      description,
      body,
      categoryId,
      authorId,
      status: status || 'draft',
      tags
    });

    return res.status(201).json({
      success: true,
      message: 'Content created successfully',
      data: content
    });
  } catch (error) {
    console.error('Error in createContent controller:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to create content',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

export const updateContent = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { title, description, body, categoryId, status, tags } = req.body;
    
    const content = await contentService.updateContent(id, {
      title,
      description,
      body,
      categoryId,
      status,
      tags
    });

    return res.status(200).json({
      success: true,
      message: 'Content updated successfully',
      data: content
    });
  } catch (error) {
    console.error('Error in updateContent controller:', error);
    if (error instanceof Error && error.message === 'Content not found') {
      return res.status(404).json({
        success: false,
        message: 'Content not found'
      });
    }
    return res.status(500).json({
      success: false,
      message: 'Failed to update content',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

export const deleteContent = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    
    await contentService.deleteContent(id);

    return res.status(200).json({
      success: true,
      message: 'Content deleted successfully'
    });
  } catch (error) {
    console.error('Error in deleteContent controller:', error);
    if (error instanceof Error && error.message === 'Content not found') {
      return res.status(404).json({
        success: false,
        message: 'Content not found'
      });
    }
    return res.status(500).json({
      success: false,
      message: 'Failed to delete content',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

// Content Category Controllers
export const getAllCategories = async (req: Request, res: Response) => {
  try {
    const categories = await contentService.getAllCategories();

    return res.status(200).json({
      success: true,
      message: 'Categories retrieved successfully',
      data: categories
    });
  } catch (error) {
    console.error('Error in getAllCategories controller:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to get categories',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

export const createCategory = async (req: Request, res: Response) => {
  try {
    const { name, description, slug } = req.body;
    
    if (!name || !description || !slug) {
      return res.status(400).json({
        success: false,
        message: 'Name, description, and slug are required'
      });
    }

    const category = await contentService.createCategory({
      name,
      description,
      slug
    });

    return res.status(201).json({
      success: true,
      message: 'Category created successfully',
      data: category
    });
  } catch (error) {
    console.error('Error in createCategory controller:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to create category',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

export const updateCategory = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { name, description, slug } = req.body;
    
    const category = await contentService.updateCategory(id, {
      name,
      description,
      slug
    });

    return res.status(200).json({
      success: true,
      message: 'Category updated successfully',
      data: category
    });
  } catch (error) {
    console.error('Error in updateCategory controller:', error);
    if (error instanceof Error && error.message === 'Category not found') {
      return res.status(404).json({
        success: false,
        message: 'Category not found'
      });
    }
    return res.status(500).json({
      success: false,
      message: 'Failed to update category',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

export const deleteCategory = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    
    await contentService.deleteCategory(id);

    return res.status(200).json({
      success: true,
      message: 'Category deleted successfully'
    });
  } catch (error) {
    console.error('Error in deleteCategory controller:', error);
    if (error instanceof Error && error.message === 'Category not found') {
      return res.status(404).json({
        success: false,
        message: 'Category not found'
      });
    }
    return res.status(500).json({
      success: false,
      message: 'Failed to delete category',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}; 
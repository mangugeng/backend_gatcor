import { Request, Response } from 'express';
import { FeedbackService } from '../../services/feedback.service';

const feedbackService = new FeedbackService();

export const getAllFeedback = async (req: Request, res: Response) => {
  try {
    const feedbacks = await feedbackService.getAllFeedback();

    return res.status(200).json({
      success: true,
      message: 'Feedbacks retrieved successfully',
      data: feedbacks
    });
  } catch (error) {
    console.error('Error in getAllFeedback controller:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to get feedbacks',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

export const getFeedbackById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    
    const feedback = await feedbackService.getFeedbackById(id);

    return res.status(200).json({
      success: true,
      message: 'Feedback retrieved successfully',
      data: feedback
    });
  } catch (error) {
    console.error('Error in getFeedbackById controller:', error);
    if (error instanceof Error && error.message === 'Feedback not found') {
      return res.status(404).json({
        success: false,
        message: 'Feedback not found'
      });
    }
    return res.status(500).json({
      success: false,
      message: 'Failed to get feedback',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

export const createFeedback = async (req: Request, res: Response) => {
  try {
    const { userId, title, description, type, status } = req.body;
    
    if (!userId || !title || !description || !type) {
      return res.status(400).json({
        success: false,
        message: 'UserId, title, description, and type are required'
      });
    }

    const feedback = await feedbackService.createFeedback({
      userId,
      title,
      description,
      type,
      status: status || 'pending'
    });

    return res.status(201).json({
      success: true,
      message: 'Feedback created successfully',
      data: feedback
    });
  } catch (error) {
    console.error('Error in createFeedback controller:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to create feedback',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

export const updateFeedback = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { title, description, type, status } = req.body;
    
    const feedback = await feedbackService.updateFeedback(id, {
      title,
      description,
      type,
      status
    });

    return res.status(200).json({
      success: true,
      message: 'Feedback updated successfully',
      data: feedback
    });
  } catch (error) {
    console.error('Error in updateFeedback controller:', error);
    if (error instanceof Error && error.message === 'Feedback not found') {
      return res.status(404).json({
        success: false,
        message: 'Feedback not found'
      });
    }
    return res.status(500).json({
      success: false,
      message: 'Failed to update feedback',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

export const deleteFeedback = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    
    await feedbackService.deleteFeedback(id);

    return res.status(200).json({
      success: true,
      message: 'Feedback deleted successfully'
    });
  } catch (error) {
    console.error('Error in deleteFeedback controller:', error);
    if (error instanceof Error && error.message === 'Feedback not found') {
      return res.status(404).json({
        success: false,
        message: 'Feedback not found'
      });
    }
    return res.status(500).json({
      success: false,
      message: 'Failed to delete feedback',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}; 
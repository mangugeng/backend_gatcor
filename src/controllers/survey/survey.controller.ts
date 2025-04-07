import { Request, Response } from 'express';
import { SurveyService } from '../../services/survey.service';

const surveyService = new SurveyService();

export const createSurvey = async (req: Request, res: Response) => {
  try {
    const { title, description, startDate, endDate, isActive, questions } = req.body;
    
    if (!title || !description || !startDate || !endDate || !questions) {
      return res.status(400).json({
        success: false,
        message: 'Title, description, startDate, endDate, and questions are required'
      });
    }

    const survey = await surveyService.createSurvey({
      title,
      description,
      startDate: new Date(startDate),
      endDate: new Date(endDate),
      isActive: isActive || true,
      questions
    });

    return res.status(201).json({
      success: true,
      message: 'Survey created successfully',
      data: survey
    });
  } catch (error) {
    console.error('Error in createSurvey controller:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to create survey',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

export const getAllSurveys = async (req: Request, res: Response) => {
  try {
    const surveys = await surveyService.getAllSurveys();

    return res.status(200).json({
      success: true,
      message: 'Surveys retrieved successfully',
      data: surveys
    });
  } catch (error) {
    console.error('Error in getAllSurveys controller:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to get surveys',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

export const getSurveyById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    
    const survey = await surveyService.getSurveyById(id);

    return res.status(200).json({
      success: true,
      message: 'Survey retrieved successfully',
      data: survey
    });
  } catch (error) {
    console.error('Error in getSurveyById controller:', error);
    if (error instanceof Error && error.message === 'Survey not found') {
      return res.status(404).json({
        success: false,
        message: 'Survey not found'
      });
    }
    return res.status(500).json({
      success: false,
      message: 'Failed to get survey',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

export const updateSurvey = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { title, description, startDate, endDate, isActive, questions } = req.body;
    
    const survey = await surveyService.updateSurvey(id, {
      title,
      description,
      startDate: startDate ? new Date(startDate) : undefined,
      endDate: endDate ? new Date(endDate) : undefined,
      isActive,
      questions
    });

    return res.status(200).json({
      success: true,
      message: 'Survey updated successfully',
      data: survey
    });
  } catch (error) {
    console.error('Error in updateSurvey controller:', error);
    if (error instanceof Error && error.message === 'Survey not found') {
      return res.status(404).json({
        success: false,
        message: 'Survey not found'
      });
    }
    return res.status(500).json({
      success: false,
      message: 'Failed to update survey',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

export const deleteSurvey = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    
    await surveyService.deleteSurvey(id);

    return res.status(200).json({
      success: true,
      message: 'Survey deleted successfully'
    });
  } catch (error) {
    console.error('Error in deleteSurvey controller:', error);
    if (error instanceof Error && error.message === 'Survey not found') {
      return res.status(404).json({
        success: false,
        message: 'Survey not found'
      });
    }
    return res.status(500).json({
      success: false,
      message: 'Failed to delete survey',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

export const addSurveyResponse = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { userId, answers } = req.body;
    
    if (!userId || !answers) {
      return res.status(400).json({
        success: false,
        message: 'UserId and answers are required'
      });
    }

    const response = await surveyService.addSurveyResponse(id, {
      userId,
      answers
    });

    return res.status(201).json({
      success: true,
      message: 'Survey response added successfully',
      data: response
    });
  } catch (error) {
    console.error('Error in addSurveyResponse controller:', error);
    if (error instanceof Error && error.message === 'Survey not found') {
      return res.status(404).json({
        success: false,
        message: 'Survey not found'
      });
    }
    return res.status(500).json({
      success: false,
      message: 'Failed to add survey response',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

export const getSurveyResponses = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    
    const responses = await surveyService.getSurveyResponses(id);

    return res.status(200).json({
      success: true,
      message: 'Survey responses retrieved successfully',
      data: responses
    });
  } catch (error) {
    console.error('Error in getSurveyResponses controller:', error);
    if (error instanceof Error && error.message === 'Survey not found') {
      return res.status(404).json({
        success: false,
        message: 'Survey not found'
      });
    }
    return res.status(500).json({
      success: false,
      message: 'Failed to get survey responses',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

export const getAllFeedback = async (req: Request, res: Response) => {
  try {
    return res.status(200).json({
      success: true,
      message: 'Daftar feedback berhasil diambil',
      data: []
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Terjadi kesalahan server'
    });
  }
};

export const submitFeedback = async (req: Request, res: Response) => {
  try {
    return res.status(201).json({
      success: true,
      message: 'Feedback berhasil disimpan',
      data: req.body
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Terjadi kesalahan server'
    });
  }
};

export const getFeedbackById = async (req: Request, res: Response) => {
  try {
    return res.status(200).json({
      success: true,
      message: 'Data feedback berhasil diambil',
      data: { id: req.params.id }
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Terjadi kesalahan server'
    });
  }
};

export const updateFeedback = async (req: Request, res: Response) => {
  try {
    return res.status(200).json({
      success: true,
      message: 'Feedback berhasil diperbarui',
      data: { id: req.params.id, ...req.body }
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Terjadi kesalahan server'
    });
  }
};

export const deleteFeedback = async (req: Request, res: Response) => {
  try {
    return res.status(200).json({
      success: true,
      message: 'Feedback berhasil dihapus',
      data: { id: req.params.id }
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Terjadi kesalahan server'
    });
  }
}; 
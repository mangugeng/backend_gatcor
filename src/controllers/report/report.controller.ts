import { Request, Response } from 'express';
import { ReportService } from '../../services/report.service';

const reportService = new ReportService();

export const getOrderReport = async (req: Request, res: Response) => {
  try {
    const { startDate, endDate } = req.query;
    
    if (!startDate || !endDate) {
      return res.status(400).json({
        success: false,
        message: 'Start date and end date are required'
      });
    }

    const report = await reportService.getOrderReport(
      new Date(startDate as string),
      new Date(endDate as string)
    );

    return res.status(200).json({
      success: true,
      message: 'Order report retrieved successfully',
      data: report
    });
  } catch (error) {
    console.error('Error in getOrderReport controller:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to get order report',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

export const getPaymentReport = async (req: Request, res: Response) => {
  try {
    const { startDate, endDate } = req.query;
    
    if (!startDate || !endDate) {
      return res.status(400).json({
        success: false,
        message: 'Start date and end date are required'
      });
    }

    const report = await reportService.getPaymentReport(
      new Date(startDate as string),
      new Date(endDate as string)
    );

    return res.status(200).json({
      success: true,
      message: 'Payment report retrieved successfully',
      data: report
    });
  } catch (error) {
    console.error('Error in getPaymentReport controller:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to get payment report',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

export const getDriverReport = async (req: Request, res: Response) => {
  try {
    const { startDate, endDate } = req.query;
    
    if (!startDate || !endDate) {
      return res.status(400).json({
        success: false,
        message: 'Start date and end date are required'
      });
    }

    const report = await reportService.getDriverReport(
      new Date(startDate as string),
      new Date(endDate as string)
    );

    return res.status(200).json({
      success: true,
      message: 'Driver report retrieved successfully',
      data: report
    });
  } catch (error) {
    console.error('Error in getDriverReport controller:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to get driver report',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

export const getCustomerReport = async (req: Request, res: Response) => {
  try {
    const { startDate, endDate } = req.query;
    
    if (!startDate || !endDate) {
      return res.status(400).json({
        success: false,
        message: 'Start date and end date are required'
      });
    }

    const report = await reportService.getCustomerReport(
      new Date(startDate as string),
      new Date(endDate as string)
    );

    return res.status(200).json({
      success: true,
      message: 'Customer report retrieved successfully',
      data: report
    });
  } catch (error) {
    console.error('Error in getCustomerReport controller:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to get customer report',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

export const getPromotionReport = async (req: Request, res: Response) => {
  try {
    const { startDate, endDate } = req.query;
    
    if (!startDate || !endDate) {
      return res.status(400).json({
        success: false,
        message: 'Start date and end date are required'
      });
    }

    const report = await reportService.getPromotionReport(
      new Date(startDate as string),
      new Date(endDate as string)
    );

    return res.status(200).json({
      success: true,
      message: 'Promotion report retrieved successfully',
      data: report
    });
  } catch (error) {
    console.error('Error in getPromotionReport controller:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to get promotion report',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

export const getRatingReport = async (req: Request, res: Response) => {
  try {
    const { startDate, endDate } = req.query;
    
    if (!startDate || !endDate) {
      return res.status(400).json({
        success: false,
        message: 'Start date and end date are required'
      });
    }

    const report = await reportService.getRatingReport(
      new Date(startDate as string),
      new Date(endDate as string)
    );

    return res.status(200).json({
      success: true,
      message: 'Rating report retrieved successfully',
      data: report
    });
  } catch (error) {
    console.error('Error in getRatingReport controller:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to get rating report',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

export const getAnalyticsReport = async (req: Request, res: Response) => {
  try {
    const { startDate, endDate } = req.query;
    
    if (!startDate || !endDate) {
      return res.status(400).json({
        success: false,
        message: 'Start date and end date are required'
      });
    }

    const report = await reportService.getAnalyticsReport(
      new Date(startDate as string),
      new Date(endDate as string)
    );

    return res.status(200).json({
      success: true,
      message: 'Analytics report retrieved successfully',
      data: report
    });
  } catch (error) {
    console.error('Error in getAnalyticsReport controller:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to get analytics report',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}; 
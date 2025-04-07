import { Request, Response } from 'express';
import { FinanceService } from '../services/finance.service';

const financeService = new FinanceService();

export class FinanceController {
  async getFinancialReports(req: Request, res: Response) {
    try {
      const {
        startDate,
        endDate,
        type,
        status,
        page,
        limit
      } = req.query;

      const result = await financeService.getFinancialReports({
        startDate: startDate ? new Date(startDate as string) : undefined,
        endDate: endDate ? new Date(endDate as string) : undefined,
        type: type as string,
        status: status as string,
        page: parseInt(page as string) || 1,
        limit: parseInt(limit as string) || 10
      });

      res.status(result.success ? 200 : 400).json(result);
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Terjadi kesalahan internal server',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  async getTransactionStatistics(req: Request, res: Response) {
    try {
      const result = await financeService.getTransactionStatistics();
      res.status(result.success ? 200 : 400).json(result);
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Terjadi kesalahan internal server',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  async getTransactionDetails(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const result = await financeService.getTransactionDetails(id);
      res.status(result.success ? 200 : 404).json(result);
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Terjadi kesalahan internal server',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  async createTransaction(req: Request, res: Response) {
    try {
      const result = await financeService.createTransaction(req.body);
      res.status(result.success ? 201 : 400).json(result);
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Terjadi kesalahan internal server',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  async updateTransactionStatus(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { status } = req.body;
      const result = await financeService.updateTransactionStatus(id, status);
      res.status(result.success ? 200 : 404).json(result);
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Terjadi kesalahan internal server',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }
} 
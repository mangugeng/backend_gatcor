import { PrismaClient } from '@prisma/client';
import { Response } from '../types/response';

const prisma = new PrismaClient();

export class WorkflowService {
  async createWorkflow(data: {
    name: string;
    description: string;
    steps: any[];
    triggers: any[];
    conditions: any[];
    actions: any[];
    metadata?: any;
  }): Promise<Response> {
    try {
      const workflow = await prisma.workflow.create({
        data: {
          name: data.name,
          description: data.description,
          steps: data.steps,
          triggers: data.triggers,
          conditions: data.conditions,
          actions: data.actions,
          metadata: data.metadata
        }
      });

      return {
        success: true,
        message: 'Workflow berhasil dibuat',
        data: workflow
      };
    } catch (error) {
      console.error('Error creating workflow:', error);
      return {
        success: false,
        message: 'Gagal membuat workflow',
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  async getWorkflowById(id: string): Promise<Response> {
    try {
      const workflow = await prisma.workflow.findUnique({
        where: { id }
      });

      if (!workflow) {
        return {
          success: false,
          message: 'Workflow tidak ditemukan'
        };
      }

      return {
        success: true,
        message: 'Workflow berhasil ditemukan',
        data: workflow
      };
    } catch (error) {
      console.error('Error getting workflow:', error);
      return {
        success: false,
        message: 'Gagal mendapatkan workflow',
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  async updateWorkflow(id: string, data: {
    name?: string;
    description?: string;
    steps?: any[];
    triggers?: any[];
    conditions?: any[];
    actions?: any[];
    metadata?: any;
  }): Promise<Response> {
    try {
      const workflow = await prisma.workflow.findUnique({
        where: { id }
      });

      if (!workflow) {
        return {
          success: false,
          message: 'Workflow tidak ditemukan'
        };
      }

      const updatedWorkflow = await prisma.workflow.update({
        where: { id },
        data
      });

      return {
        success: true,
        message: 'Workflow berhasil diupdate',
        data: updatedWorkflow
      };
    } catch (error) {
      console.error('Error updating workflow:', error);
      return {
        success: false,
        message: 'Gagal mengupdate workflow',
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  async deleteWorkflow(id: string): Promise<Response> {
    try {
      const workflow = await prisma.workflow.findUnique({
        where: { id }
      });

      if (!workflow) {
        return {
          success: false,
          message: 'Workflow tidak ditemukan'
        };
      }

      await prisma.workflow.delete({
        where: { id }
      });

      return {
        success: true,
        message: 'Workflow berhasil dihapus'
      };
    } catch (error) {
      console.error('Error deleting workflow:', error);
      return {
        success: false,
        message: 'Gagal menghapus workflow',
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  async getAllWorkflows(page: number = 1, limit: number = 10): Promise<Response> {
    try {
      const skip = (page - 1) * limit;

      const [workflows, total] = await Promise.all([
        prisma.workflow.findMany({
          skip,
          take: limit,
          orderBy: { createdAt: 'desc' }
        }),
        prisma.workflow.count()
      ]);

      return {
        success: true,
        message: 'Daftar workflow berhasil didapatkan',
        data: {
          workflows,
          pagination: {
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit)
          }
        }
      };
    } catch (error) {
      console.error('Error getting workflows:', error);
      return {
        success: false,
        message: 'Gagal mendapatkan daftar workflow',
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  async executeWorkflow(id: string, data: any): Promise<Response> {
    try {
      const workflow = await prisma.workflow.findUnique({
        where: { id }
      });

      if (!workflow) {
        return {
          success: false,
          message: 'Workflow tidak ditemukan'
        };
      }

      // Implementasi eksekusi workflow
      const executionResult = await this.processWorkflow(workflow, data);

      // Simpan history eksekusi
      await prisma.workflowExecution.create({
        data: {
          workflowId: id,
          status: executionResult.success ? 'SUCCESS' : 'FAILED',
          result: executionResult,
          input: data
        }
      });

      return {
        success: true,
        message: 'Workflow berhasil dieksekusi',
        data: executionResult
      };
    } catch (error) {
      console.error('Error executing workflow:', error);
      return {
        success: false,
        message: 'Gagal mengeksekusi workflow',
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  async getWorkflowStatus(id: string): Promise<Response> {
    try {
      const executions = await prisma.workflowExecution.findMany({
        where: { workflowId: id },
        orderBy: { createdAt: 'desc' },
        take: 1
      });

      if (executions.length === 0) {
        return {
          success: false,
          message: 'Status workflow tidak ditemukan'
        };
      }

      return {
        success: true,
        message: 'Status workflow berhasil didapatkan',
        data: executions[0]
      };
    } catch (error) {
      console.error('Error getting workflow status:', error);
      return {
        success: false,
        message: 'Gagal mendapatkan status workflow',
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  async getWorkflowHistory(id: string, page: number = 1, limit: number = 10): Promise<Response> {
    try {
      const skip = (page - 1) * limit;

      const [executions, total] = await Promise.all([
        prisma.workflowExecution.findMany({
          where: { workflowId: id },
          skip,
          take: limit,
          orderBy: { createdAt: 'desc' }
        }),
        prisma.workflowExecution.count({
          where: { workflowId: id }
        })
      ]);

      return {
        success: true,
        message: 'Riwayat workflow berhasil didapatkan',
        data: {
          executions,
          pagination: {
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit)
          }
        }
      };
    } catch (error) {
      console.error('Error getting workflow history:', error);
      return {
        success: false,
        message: 'Gagal mendapatkan riwayat workflow',
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  private async processWorkflow(workflow: any, data: any): Promise<any> {
    try {
      const { steps, conditions, actions } = workflow;

      // Evaluasi kondisi
      for (const condition of conditions) {
        if (!this.evaluateCondition(condition, data)) {
          return {
            success: false,
            message: 'Kondisi workflow tidak terpenuhi',
            condition
          };
        }
      }

      // Eksekusi langkah-langkah
      let result = data;
      for (const step of steps) {
        result = await this.executeStep(step, result);
      }

      // Eksekusi aksi
      for (const action of actions) {
        await this.executeAction(action, result);
      }

      return {
        success: true,
        message: 'Workflow berhasil diproses',
        result
      };
    } catch (error) {
      console.error('Error processing workflow:', error);
      return {
        success: false,
        message: 'Gagal memproses workflow',
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  private evaluateCondition(condition: any, data: any): boolean {
    // Implementasi evaluasi kondisi
    // Contoh sederhana, bisa dikembangkan sesuai kebutuhan
    const { field, operator, value } = condition;
    const fieldValue = data[field];

    switch (operator) {
      case 'equals':
        return fieldValue === value;
      case 'notEquals':
        return fieldValue !== value;
      case 'greaterThan':
        return fieldValue > value;
      case 'lessThan':
        return fieldValue < value;
      case 'contains':
        return fieldValue.includes(value);
      default:
        return false;
    }
  }

  private async executeStep(step: any, data: any): Promise<any> {
    // Implementasi eksekusi langkah
    // Contoh sederhana, bisa dikembangkan sesuai kebutuhan
    const { type, action } = step;

    switch (type) {
      case 'transform':
        return this.transformData(data, action);
      case 'validate':
        return this.validateData(data, action);
      case 'api':
        return this.callExternalApi(data, action);
      default:
        return data;
    }
  }

  private async executeAction(action: any, data: any): Promise<void> {
    // Implementasi eksekusi aksi
    // Contoh sederhana, bisa dikembangkan sesuai kebutuhan
    const { type, config } = action;

    switch (type) {
      case 'notification':
        await this.sendNotification(config, data);
        break;
      case 'email':
        await this.sendEmail(config, data);
        break;
      case 'webhook':
        await this.triggerWebhook(config, data);
        break;
    }
  }

  private transformData(data: any, action: any): any {
    // Implementasi transformasi data
    // Contoh sederhana
    const { mapping } = action;
    const result: any = {};

    for (const [key, value] of Object.entries(mapping)) {
      result[key] = data[value as string];
    }

    return result;
  }

  private validateData(data: any, action: any): any {
    // Implementasi validasi data
    // Contoh sederhana
    const { rules } = action;

    for (const [field, rule] of Object.entries(rules)) {
      if (!data[field]) {
        throw new Error(`Field ${field} is required`);
      }
    }

    return data;
  }

  private async callExternalApi(data: any, action: any): Promise<any> {
    // Implementasi pemanggilan API eksternal
    // Contoh sederhana
    const { url, method, headers } = action;

    const response = await fetch(url, {
      method,
      headers,
      body: JSON.stringify(data)
    });

    return response.json();
  }

  private async sendNotification(config: any, data: any): Promise<void> {
    // Implementasi pengiriman notifikasi
    // Placeholder untuk integrasi dengan sistem notifikasi
    console.log('Sending notification:', { config, data });
  }

  private async sendEmail(config: any, data: any): Promise<void> {
    // Implementasi pengiriman email
    // Placeholder untuk integrasi dengan sistem email
    console.log('Sending email:', { config, data });
  }

  private async triggerWebhook(config: any, data: any): Promise<void> {
    // Implementasi trigger webhook
    // Placeholder untuk integrasi dengan sistem webhook
    console.log('Triggering webhook:', { config, data });
  }
} 